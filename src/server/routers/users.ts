import { z } from "zod";
import { procedure, router } from "../trpc";

export const usersRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  create: procedure
    .input(
      z.object({
        name: z.string().min(2).max(40),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
        },
      });

      return user;
    }),
});
