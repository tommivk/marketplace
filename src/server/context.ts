import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { req } = opts;
  const { userId } = getAuth(req);

  const prisma = new PrismaClient();

  return {
    prisma,
    userId,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
