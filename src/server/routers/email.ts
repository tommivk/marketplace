import { TRPCError } from "@trpc/server";
import { sendEmail } from "../aws";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { emailLimit, emailDailyLimit } from "../ratelimit";

export const emailRouter = router({
  sendEmail: protectedProcedure
    .input(z.object({ itemId: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await emailLimit.limit(ctx.userId);
      const { success: dailySuccess } = await emailDailyLimit.limit(
        "dailyLimit"
      );
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You're sending emails too fast",
        });
      }
      if (!dailySuccess) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      const item = await ctx.prisma.item.findFirst({
        where: { id: input.itemId },
        include: { contactDetails: true },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      const toAddress = item.contactDetails.email;
      if (!toAddress) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const emailSuccess = await sendEmail({
        toAddress,
        title: item.title,
        message: input.message,
      });
      if (!emailSuccess) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
