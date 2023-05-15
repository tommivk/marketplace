import { appRouter } from "../root";
import { prisma } from "../db";
import { TRPCError } from "@trpc/server";

const user = {
  username: "test user",
  emailAddresses: [
    {
      emailAddress: "test@test.com",
      verification: { status: "verified" },
    },
  ],
};

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: {
    users: {
      getUser: jest.fn((_userId) => Promise.resolve(user)),
      getUserList: jest.fn(() =>
        Promise.resolve([
          { ...user, username: "test" },
          { ...user, username: "tester" },
        ])
      ),
      updateUser: jest.fn(() => Promise.resolve()),
    },
  },
}));

const caller = appRouter.createCaller({ prisma, userId: null });
const callerWithUserId = appRouter.createCaller({ prisma, userId: "1337" });

describe("User tests", () => {
  it("Calling updateUsername should throw if called without userId", async () => {
    await expect(
      caller.users.updateUserName({ username: "new user" })
    ).rejects.toThrow(
      new TRPCError({
        code: "UNAUTHORIZED",
      })
    );
  });

  it("Changing username to a unique name should be possible", async () => {
    await expect(
      callerWithUserId.users.updateUserName({ username: "new user" })
    ).resolves.not.toThrow();
  });

  it("Should not be possible to update to a taken username", async () => {
    await expect(
      callerWithUserId.users.updateUserName({ username: "test" })
    ).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Username is taken",
      })
    );
  });
});
