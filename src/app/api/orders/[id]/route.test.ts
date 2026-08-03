import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const mockedAuth = auth as unknown as {
  mockResolvedValue: (session: { user: { id: string } } | null) => void;
};
const mockedFindUnique = vi.mocked(prisma.order.findUnique);
const mockedUpdate = vi.mocked(prisma.order.update);

function patchRequest(body: unknown) {
  return new Request("http://localhost/api/orders/order1", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

const context = { params: Promise.resolve({ id: "order1" }) };

describe("PATCH /api/orders/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const res = await PATCH(patchRequest({ status: "CONFIRMED" }), context);

    expect(res.status).toBe(401);
  });

  it("returns 400 for a status value the schema doesn't recognize", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "cook1" } } as never);

    const res = await PATCH(patchRequest({ status: "SHIPPED" }), context);

    expect(res.status).toBe(400);
  });

  it("returns 404 when the order doesn't exist", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "cook1" } } as never);
    mockedFindUnique.mockResolvedValue(null);

    const res = await PATCH(patchRequest({ status: "CONFIRMED" }), context);

    expect(res.status).toBe(404);
  });

  it("returns 403 when the requester isn't the listing's cook", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "someone-else" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      status: "PENDING",
      listing: { cookId: "cook1" },
    } as never);

    const res = await PATCH(patchRequest({ status: "CONFIRMED" }), context);

    expect(res.status).toBe(403);
  });

  it("rejects an invalid transition (PENDING straight to COMPLETED)", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "cook1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      status: "PENDING",
      listing: { cookId: "cook1" },
    } as never);

    const res = await PATCH(patchRequest({ status: "COMPLETED" }), context);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Cannot move order/);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it("allows a valid transition and persists it", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "cook1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      status: "PENDING",
      listing: { cookId: "cook1" },
    } as never);
    mockedUpdate.mockResolvedValue({ id: "order1", status: "CONFIRMED" } as never);

    const res = await PATCH(patchRequest({ status: "CONFIRMED" }), context);

    expect(res.status).toBe(200);
    expect(mockedUpdate).toHaveBeenCalledWith({
      where: { id: "order1" },
      data: { status: "CONFIRMED" },
    });
  });

  it("rejects CONFIRMED straight to PENDING (no backwards transitions)", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "cook1" } } as never);
    mockedFindUnique.mockResolvedValue({
      id: "order1",
      status: "CONFIRMED",
      listing: { cookId: "cook1" },
    } as never);

    const res = await PATCH(patchRequest({ status: "PENDING" }), context);

    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});
