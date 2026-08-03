import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(2000),
  imageUrl: z.string().url().optional().nullable(),
  price: z.number().positive("Price must be greater than 0"),
  servings: z.number().int().positive("Servings must be at least 1"),
  calories: z.number().int().nonnegative(),
  protein: z.number().int().nonnegative(),
  carbs: z.number().int().nonnegative(),
  fat: z.number().int().nonnegative(),
  city: z.string().min(1, "City is required").max(100),
  dietTagIds: z.array(z.string()).default([]),
});

export type ListingInput = z.infer<typeof listingSchema>;

export const listingUpdateSchema = listingSchema
  .omit({ dietTagIds: true })
  .partial()
  .extend({ dietTagIds: z.array(z.string()).optional() });

export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>;

export const orderCreateSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export const reviewCreateSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(1000).optional(),
});
