import { z } from "zod";

export const itemSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .min(2, { message: "Title must be at least 2 characters long" })
      .max(50, { message: "Title must be less than 50 characters long" }),
    description: z
      .string({ required_error: "Description is required" })
      .min(2, { message: "Description must be at least 2 characters long" })
      .max(2000, {
        message: "Description must be less than 2000 characters long",
      }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    price: z
      .number({
        required_error: "Price is required",
      })
      .min(0, "Price must be positive"),
  })
  .strict();

export const itemSchemaWithFile = itemSchema.extend({
  imageFile: typeof window === "undefined" ? z.any() : z.instanceof(File),
});
