import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  updateUserName: protectedProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(2, "Username must be at least 2 characters long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const users = await clerkClient.users.getUserList();
      const usernameTaken = users.some(
        (u) => u.username?.toLowerCase() === input.username.toLowerCase()
      );

      if (usernameTaken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is taken",
        });
      }

      await clerkClient.users.updateUser(userId, {
        username: input.username,
        publicMetadata: { finalized: true },
      });
    }),
});
