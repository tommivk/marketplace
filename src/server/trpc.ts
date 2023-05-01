import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;

const checkAuth = t.middleware(async ({ ctx, next }) => {
  const { userId } = ctx;
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(checkAuth);
