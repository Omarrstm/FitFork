import { describe, expect, it } from "vitest";
import {
  listingSchema,
  listingUpdateSchema,
  orderCreateSchema,
  orderStatusUpdateSchema,
  reviewCreateSchema,
  ORDER_STATUS_TRANSITIONS,
} from "./validation";

const validListing = {
  title: "Grilled Chicken Bowl",
  description: "Chicken, rice, broccoli",
  price: 9.99,
  servings: 5,
  calories: 550,
  protein: 45,
  carbs: 50,
  fat: 15,
  city: "Istanbul",
  dietTagIds: ["tag1"],
};

describe("listingSchema", () => {
  it("accepts a fully valid listing", () => {
    const result = listingSchema.safeParse(validListing);
    expect(result.success).toBe(true);
  });

  it("defaults dietTagIds to an empty array when omitted", () => {
    const { dietTagIds: _dietTagIds, ...rest } = validListing;
    const result = listingSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.dietTagIds).toEqual([]);
  });

  it("rejects a non-positive price", () => {
    const result = listingSchema.safeParse({ ...validListing, price: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive servings count", () => {
    const result = listingSchema.safeParse({ ...validListing, servings: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = listingSchema.safeParse({ ...validListing, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative macros", () => {
    const result = listingSchema.safeParse({ ...validListing, protein: -1 });
    expect(result.success).toBe(false);
  });
});

describe("listingUpdateSchema", () => {
  // Regression test: a partial update (e.g. price only) must NOT resolve
  // dietTagIds to an empty array, since that previously caused the API
  // route's "was dietTagIds provided?" check to always pass (an empty
  // array is truthy in JS), silently wiping existing diet tags on every
  // partial update that didn't touch them.
  it("leaves dietTagIds undefined when omitted, rather than defaulting to []", () => {
    const result = listingUpdateSchema.safeParse({ price: 12.5 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.dietTagIds).toBeUndefined();
  });

  it("still accepts an explicit empty array (intentionally clearing tags)", () => {
    const result = listingUpdateSchema.safeParse({ dietTagIds: [] });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.dietTagIds).toEqual([]);
  });

  it("accepts a partial update with just one field", () => {
    const result = listingUpdateSchema.safeParse({ city: "Ankara" });
    expect(result.success).toBe(true);
  });

  it("still validates field constraints on partial updates", () => {
    const result = listingUpdateSchema.safeParse({ price: -5 });
    expect(result.success).toBe(false);
  });
});

describe("orderCreateSchema", () => {
  it("accepts a valid order", () => {
    const result = orderCreateSchema.safeParse({ listingId: "abc", quantity: 2 });
    expect(result.success).toBe(true);
  });

  it("rejects a zero or negative quantity", () => {
    expect(orderCreateSchema.safeParse({ listingId: "abc", quantity: 0 }).success).toBe(false);
    expect(orderCreateSchema.safeParse({ listingId: "abc", quantity: -1 }).success).toBe(false);
  });

  it("rejects a non-integer quantity", () => {
    const result = orderCreateSchema.safeParse({ listingId: "abc", quantity: 1.5 });
    expect(result.success).toBe(false);
  });
});

describe("orderStatusUpdateSchema", () => {
  it("accepts each valid status", () => {
    for (const status of ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]) {
      expect(orderStatusUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects an unknown status", () => {
    const result = orderStatusUpdateSchema.safeParse({ status: "SHIPPED" });
    expect(result.success).toBe(false);
  });
});

describe("ORDER_STATUS_TRANSITIONS", () => {
  it("allows PENDING to move to CONFIRMED or CANCELLED only", () => {
    expect(ORDER_STATUS_TRANSITIONS.PENDING).toEqual(["CONFIRMED", "CANCELLED"]);
  });

  it("allows CONFIRMED to move to COMPLETED or CANCELLED only", () => {
    expect(ORDER_STATUS_TRANSITIONS.CONFIRMED).toEqual(["COMPLETED", "CANCELLED"]);
  });

  it("does not allow PENDING to jump straight to COMPLETED", () => {
    expect(ORDER_STATUS_TRANSITIONS.PENDING).not.toContain("COMPLETED");
  });

  it("has no further transitions once COMPLETED or CANCELLED", () => {
    expect(ORDER_STATUS_TRANSITIONS.COMPLETED).toEqual([]);
    expect(ORDER_STATUS_TRANSITIONS.CANCELLED).toEqual([]);
  });
});

describe("reviewCreateSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewCreateSchema.safeParse({
      orderId: "order1",
      rating: 4,
      comment: "Great!",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a review with no comment", () => {
    const result = reviewCreateSchema.safeParse({ orderId: "order1", rating: 5 });
    expect(result.success).toBe(true);
  });

  it("rejects a rating below 1", () => {
    expect(reviewCreateSchema.safeParse({ orderId: "order1", rating: 0 }).success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    expect(reviewCreateSchema.safeParse({ orderId: "order1", rating: 6 }).success).toBe(false);
  });

  it("rejects a non-integer rating", () => {
    expect(reviewCreateSchema.safeParse({ orderId: "order1", rating: 3.5 }).success).toBe(false);
  });
});
