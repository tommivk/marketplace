import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/schema";
import { createPresignedPOSTLink, fileExists } from "../aws";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Item } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { getUsersVerifiedEmailAddresses } from "@/server/utils";

// Allow 2 requests per 5 minutes
const uploadLinkLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "5 m"),
  analytics: true,
});
const createLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 m"),
  analytics: true,
});

const dailyLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 d"),
  analytics: true,
});

export const itemsRouter = router({
  createUploadURL: protectedProcedure
    .input(z.object({ contentLength: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await uploadLinkLimit.limit(ctx.userId);
      const { success: dailySuccess } = await dailyLimit.limit(ctx.userId);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are creating items too fast",
        });
      }
      if (!dailySuccess) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Daily limit reached",
        });
      }

      const { contentLength } = input;

      if (contentLength / (1024 * 1024) > 5) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: "Maximum image size is 5 MB",
        });
      }

      const { uploadURL, fileName } = await createPresignedPOSTLink({
        contentLength,
        userId: ctx.userId,
      });

      return { uploadURL, fileName };
    }),

  getAll: procedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({ include: { image: true } });
    return items;
  }),

  getNewest: procedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({
      take: 10,
      orderBy: [{ createdAt: "desc" }],
      include: {
        image: true,
      },
    });

    return items;
  }),

  search: procedure
    .input(
      z.object({
        query: z.string().optional(),
        orderBy: z.string().optional().default("1"),
        c: z.string().optional(),
        page: z.number().min(1).optional().default(1),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const orderBy = getOrderbyArgs(input.orderBy);

      const query = await ctx.prisma.$transaction([
        ctx.prisma.item.count({
          where: {
            OR: [
              {
                title: { contains: input.query },
              },
              { description: { contains: input.query } },
            ],
            category: {
              name: {
                contains: input.c,
              },
            },
          },
        }),
        ctx.prisma.item.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: {
            OR: [
              {
                title: { contains: input.query },
              },
              { description: { contains: input.query } },
            ],
            category: {
              name: {
                contains: input.c,
              },
            },
          },
          include: {
            image: true,
            category: true,
          },
          orderBy,
        }),
      ]);

      return { searchCount: query[0], items: query[1] };
    }),

  findById: procedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findUnique({
        where: { id: input.itemId },
        include: { image: true, contactDetails: true },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      const username = (await clerkClient.users.getUser(item.authorId))
        .username;

      if (!username) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No username",
        });
      }

      return {
        ...item,
        contactDetails: { ...item.contactDetails, username },
      };
    }),

  create: protectedProcedure
    .input(
      itemSchema.extend({
        fileName: z.string().min(1),
        email: z.string().email().optional(),
        phoneNumber: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileName, email, phoneNumber } = input;

      if (!email && !phoneNumber)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email or phone number must be provided",
        });

      if (email) {
        const emailAddresses = await getUsersVerifiedEmailAddresses(userId);
        if (!emailAddresses.includes(email)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid email address",
          });
        }
      }

      const filePath = `${userId}/${fileName}`;

      const { success } = await createLimit.limit(userId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const validImage = await fileExists(filePath);
      if (!validImage) throw new TRPCError({ code: "BAD_REQUEST" });

      const { id: imageId } = await ctx.prisma.image.create({
        data: {
          authorId: userId,
          imageURL: `https://tommivk-marketplace.imgix.net/${filePath}`,
        },
      });

      const { id: contactDetailsId } = await ctx.prisma.contactDetails.create({
        data: {
          email,
          phoneNumber,
        },
      });

      const item = await ctx.prisma.item.create({
        data: {
          authorId: userId,
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          price: input.price,
          imageId,
          contactDetailsId,
        },
      });

      return item;
    }),
});

const getOrderbyArgs = (order?: string) => {
  const orderBy: Partial<Record<keyof Item, "asc" | "desc">> = {};

  switch (order) {
    case "1":
      orderBy["createdAt"] = "desc";
      break;
    case "2":
      orderBy["createdAt"] = "asc";
      break;
    case "3":
      orderBy["price"] = "desc";
      break;
    case "4":
      orderBy["price"] = "asc";
      break;
    default:
      return;
  }

  return orderBy;
};
