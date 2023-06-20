import { procedure, router } from "../trpc";

export const categoriesRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: [{ createdAt: "asc" }],
    });
    return categories;
  }),

  getAllWithItemCount: procedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: [{ createdAt: "asc" }],
    });

    const result = await Promise.all(
      categories.map(async (category) => {
        const itemCount = await ctx.prisma.item.count({
          where: { categoryId: category.id },
        });
        return { ...category, itemCount };
      })
    );

    return result;
  }),
});
