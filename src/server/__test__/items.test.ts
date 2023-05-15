import { appRouter } from "../root";
import { prisma } from "../db";
import { TRPCError } from "@trpc/server";
import { Category, Prisma } from "@prisma/client";

jest.mock("@clerk/nextjs/server", () => ({
  clerkClient: {
    users: {
      getUser: jest.fn((_userId) =>
        Promise.resolve({
          username: "test user",
          emailAddresses: [
            {
              emailAddress: "test@test.com",
              verification: { status: "verified" },
            },
          ],
        })
      ),
    },
  },
}));

jest.mock("../ratelimit", () => ({
  createLimit: {
    limit: jest.fn(() => ({
      success: true,
    })),
  },
  dailyLimit: {
    limit: jest.fn(() => ({
      success: true,
    })),
  },
}));

jest.mock("../aws", () => ({
  fileExists: jest.fn(() => true),
}));

let itemData: Prisma.ItemCreateManyInput[];
let categories: Category[];

beforeAll(async () => {
  await prisma.category.createMany({
    data: [
      { name: "category1", imageURL: "image1.jpg" },
      { name: "category2", imageURL: "image2.jpg" },
      { name: "category3", imageURL: "image3.jpg" },
    ],
  });

  categories = await prisma.category.findMany();

  const { id: contactDetailsId } = await prisma.contactDetails.create({
    data: { email: "test@test.com" },
  });

  const imageData = { authorId: "1", imageURL: "test.jpg" };

  const { id: imageOneId } = await prisma.image.create({
    data: imageData,
  });
  const { id: imageTwoId } = await prisma.image.create({
    data: imageData,
  });
  const { id: imageThreeId } = await prisma.image.create({
    data: imageData,
  });

  itemData = [
    {
      authorId: "1",
      categoryId: categories[0].id,
      contactDetailsId,
      description: "Item description",
      imageId: imageOneId,
      price: 20,
      title: "Test item",
    },
    {
      authorId: "3",
      categoryId: categories[1].id,
      contactDetailsId,
      description: "Item description 2",
      imageId: imageTwoId,
      price: 34,
      title: "Test item 2",
    },
    {
      authorId: "1",
      categoryId: categories[2].id,
      contactDetailsId,
      description: "Item description 3",
      imageId: imageThreeId,
      price: 5,
      title: "Test item 3",
    },
  ];

  await prisma.item.createMany({
    data: itemData,
  });
});

const caller = appRouter.createCaller({ prisma, userId: null });
const callerWithUserId = appRouter.createCaller({ prisma, userId: "1337" });

describe("Item tests", () => {
  it("Protected routes should throw when called without userId", async () => {
    await expect(
      caller.items.createUploadURL({ contentLength: 44 })
    ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));

    await expect(
      caller.items.create({
        categoryId: "0",
        description: "",
        fileName: "",
        price: 1,
        title: "",
        email: "",
      })
    ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
  });

  it("getAll returns correct data", async () => {
    const response = await caller.items.getAll();
    expect(response.length).toBe(3);
    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining(itemData[0]),
        expect.objectContaining(itemData[1]),
        expect.objectContaining(itemData[2]),
      ])
    );
  });

  it("getItemsByUser returns correct items", async () => {
    const response = await caller.items.getItemsByUser({ userId: "1" });
    expect(response.length).toBe(2);
    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining(itemData[0]),
        expect.objectContaining(itemData[2]),
      ])
    );
  });

  it("Should not be possible to create an item without contact details", async () => {
    const input = {
      categoryId: categories[0].id,
      description: "Item description",
      price: 20,
      title: "Test item",
      fileName: "file",
    };
    await expect(callerWithUserId.items.create(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Email or phone number must be provided",
      })
    );
  });
});

afterAll(async () => {
  const deleteImages = prisma.image.deleteMany();
  const deleteContactDetails = prisma.contactDetails.deleteMany();
  const deleteItem = prisma.item.deleteMany();
  const deleteCategories = prisma.category.deleteMany();

  await prisma.$transaction([
    deleteItem,
    deleteContactDetails,
    deleteImages,
    deleteCategories,
  ]);

  await prisma.$disconnect();
});
