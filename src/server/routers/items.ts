import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/schema";

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
    .input(itemSchema)
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
