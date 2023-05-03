import { z } from "zod";
import { procedure, router } from "../trpc";

export const categoriesRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: [{ createdAt: "asc" }],
    });
    return categories;
  }),

  //    TODO add admin validation
  create: procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: { name: input.name },
      });
      return category;
    }),
});
