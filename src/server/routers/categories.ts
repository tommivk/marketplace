import { z } from "zod";
import { procedure, router } from "../trpc";

export const categoriesRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: [{ createdAt: "asc" }],
    });
    return categories;
  }),

  getItemCount: procedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      const itemCount = await ctx.prisma.item.count({
        where: { categoryId: input.categoryId },
      });
      return itemCount;
    }),
});
