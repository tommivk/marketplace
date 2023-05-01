import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const itemsRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany();
    return items;
  }),

  findById: procedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findUnique({
        where: { id: input.itemId },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      return item;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(50),
        description: z.string().min(2).max(2000),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.create({
        data: {
          ...input,
          authorId: ctx.userId,
        },
      });

      return item;
    }),
});
