import { z } from "zod";
import { procedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  getAll: procedure.query(async () => {
    return await clerkClient.users.getUserList();
  }),

  findById: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await clerkClient.users.getUser(input.userId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),
});
