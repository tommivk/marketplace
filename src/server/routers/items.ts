import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/schema";
import { createPresignedPOSTLink } from "../aws";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Allow 2 requests per 5 minutes
const uploadLinkLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "5 m"),
  analytics: true,
});
const createLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "5 m"),
  analytics: true,
});

export const itemsRouter = router({
  createUploadURL: protectedProcedure
    .input(z.object({ contentLength: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await uploadLinkLimit.limit(ctx.userId);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are creating items too fast",
        });
      }

      const { contentLength } = input;

      if (contentLength / (1024 * 1024) > 5) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: "Maximum image size is 5 MB",
        });
      }

      const { uploadURL, fileName } = await createPresignedPOSTLink(
        contentLength
      );

      return { uploadURL, fileName };
    }),

  getAll: procedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({ include: { image: true } });
    return items;
  }),

  getNewest: procedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({
      take: 5,
      orderBy: [{ createdAt: "desc" }],
      include: {
        image: true,
      },
    });

    return items;
  }),

  findById: procedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findUnique({
        where: { id: input.itemId },
        include: { image: true },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      return item;
    }),

  create: protectedProcedure
    .input(itemSchema.extend({ fileName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileName } = input;

      const filePath = `${userId}/${fileName}`;

      const { success } = await createLimit.limit(userId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const { id: imageId } = await ctx.prisma.image.create({
        data: {
          authorId: userId,
          imageURL: `https://tommivk-marketplace.imgix.net/${filePath}`,
        },
      });

      const item = await ctx.prisma.item.create({
        data: {
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          price: input.price,
          authorId: ctx.userId,
          imageId,
        },
      });

      return item;
    }),
});
