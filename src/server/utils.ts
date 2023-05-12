import { clerkClient } from "@clerk/nextjs/server";

export const getUsersVerifiedEmailAddresses = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const userEmails = user.emailAddresses;
  const verifiedAddresses = userEmails.filter(
    (email) => email.verification?.status === "verified"
  );
  const emailAddresses = verifiedAddresses.map((email) => email.emailAddress);
  return emailAddresses;
};
