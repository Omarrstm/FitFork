import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewCreateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reviewCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { orderId, rating, comment } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { review: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (order.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "You can only review completed orders" },
      { status: 400 }
    );
  }
  if (order.review) {
    return NextResponse.json(
      { error: "You already reviewed this order" },
      { status: 409 }
    );
  }

  const review = await prisma.review.create({
    data: {
      orderId,
      listingId: order.listingId,
      buyerId: session.user.id,
      rating,
      comment,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
