import { User } from "@clerk/nextjs/dist/api";
import { getUsersVerifiedEmailAddresses } from "../utils";

const user = {
  id: "123",
  username: "Test user",
  emailAddresses: [
    {
      id: "1",
      emailAddress: "test1@test.com",
      verification: { status: "verified" },
    },
    {
      id: "2",
      emailAddress: "test2@test.com",
      verification: { status: "unverified" },
    },
    {
      id: "3",
      emailAddress: "test3@test.com",
      verification: { status: "verified" },
    },
  ],
} as User;

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: {
    users: {
      getUser: jest.fn((_userId) => Promise.resolve(user)),
    },
  },
}));

describe("Util tests", () => {
  it("getUsersVerifiedEmailAddresses returns correct addresses", async () => {
    const result = await getUsersVerifiedEmailAddresses(user.id);
    expect(result.length).toBe(2);
    expect(result).toEqual(["test1@test.com", "test3@test.com"]);
  });
});
