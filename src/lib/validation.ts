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
