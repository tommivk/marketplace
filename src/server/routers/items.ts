import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/schema";

export const itemsRouter = router({
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
    .input(itemSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: imageId } = await ctx.prisma.image.create({
        data: { authorId: ctx.userId, imageURL: "/category/potato.jpg" },
      });

      const item = await ctx.prisma.item.create({
        data: {
          ...input,
          authorId: ctx.userId,
          imageId,
        },
      });

      return item;
    }),
});
