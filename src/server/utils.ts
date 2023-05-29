import { clerkClient } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "./root";
import { prisma } from "./db";
import superjson from "superjson";

export const getUsersVerifiedEmailAddresses = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const userEmails = user.emailAddresses;
  const verifiedAddresses = userEmails.filter(
    (email) => email.verification?.status === "verified"
  );
  const emailAddresses = verifiedAddresses.map((email) => email.emailAddress);
  return emailAddresses;
};

export const getUserByUserName = async (username: string) => {
  const userList = await clerkClient.users.getUserList({
    username: [username],
  });
  return userList[0];
};

export const getServerSideHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
