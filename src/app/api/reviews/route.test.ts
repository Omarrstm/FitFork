import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
    },
    review: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const mockedAuth = auth as unknown as {
  mockResolvedValue: (session: { user: { id: string } } | null) => void;
};
const mockedFindUnique = vi.mocked(prisma.order.findUnique);
const mockedCreate = vi.mocked(prisma.review.create);

function postRequest(body: unknown) {
  return new Request("http://localhost/api/reviews", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const res = await POST(postRequest({ orderId: "order1", rating: 5 }));

    expect(res.status).toBe(401);
  });

  it("returns 400 for an out-of-range rating", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "buyer1" } } as never);

    const res = await POST(postRequest({ orderId: "order1", rating: 6 }));

    expect(res.status).toBe(400);
  });

  it("returns 404 when the order doesn't exist", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "buyer1" } } as never);
    mockedFindUnique.mockResolvedValue(null);

    const res = await POST(postRequest({ orderId: "order1", rating: 5 }));

    expect(res.status).toBe(404);
  });

  it("returns 403 when the requester isn't the order's buyer", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "someone-else" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      buyerId: "buyer1",
      status: "COMPLETED",
      review: null,
    } as never);

    const res = await POST(postRequest({ orderId: "order1", rating: 5 }));

    expect(res.status).toBe(403);
  });

  it("rejects reviewing an order that isn't COMPLETED", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "buyer1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      buyerId: "buyer1",
      status: "PENDING",
      review: null,
    } as never);

    const res = await POST(postRequest({ orderId: "order1", rating: 5 }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/completed orders/);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("rejects a duplicate review on the same order", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "buyer1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      buyerId: "buyer1",
      status: "COMPLETED",
      review: { id: "existing-review" },
    } as never);

    const res = await POST(postRequest({ orderId: "order1", rating: 5 }));

    expect(res.status).toBe(409);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("creates a review for a valid, completed, unreviewed order", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "buyer1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      buyerId: "buyer1",
      listingId: "listing1",
      status: "COMPLETED",
      review: null,
    } as never);
    mockedCreate.mockResolvedValue({ id: "review1", rating: 5 } as never);

    const res = await POST(postRequest({ orderId: "order1", rating: 5, comment: "Great!" }));

    expect(res.status).toBe(201);
    expect(mockedCreate).toHaveBeenCalledWith({
      data: {
        orderId: "order1",
        listingId: "listing1",
        buyerId: "buyer1",
        rating: 5,
        comment: "Great!",
      },
    });
  });
});
