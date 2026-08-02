import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { orderCreateSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { listing: { include: { cook: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { listingId, quantity } = parsed.data;

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || !listing.isActive) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (listing.cookId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot order your own listing" },
      { status: 400 }
    );
  }
  if (quantity > listing.servings) {
    return NextResponse.json(
      { error: `Only ${listing.servings} servings available` },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      listingId,
      buyerId: session.user.id,
      quantity,
      totalPrice: listing.price.mul(quantity),
    },
    include: { listing: true },
  });

  return NextResponse.json({ order }, { status: 201 });
}
