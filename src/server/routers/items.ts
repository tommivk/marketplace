import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/schema";
import { createPresignedPOSTLink } from "../aws";

export const itemsRouter = router({
  // TODO: Add rate limiting
  createUploadURL: protectedProcedure.mutation(async () => {
    const { uploadURL, fileName } = await createPresignedPOSTLink();
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
      const { id: imageId } = await ctx.prisma.image.create({
        data: {
          authorId: ctx.userId,
          imageURL: `https://tommivk-marketplace.imgix.net/${input.fileName}`,
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
