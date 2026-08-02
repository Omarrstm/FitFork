import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { listingUpdateSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      cook: { select: { id: true, name: true, city: true, bio: true } },
      dietTags: { include: { dietTag: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (existing.cookId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = listingUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { dietTagIds, ...data } = parsed.data;

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      ...data,
      ...(dietTagIds !== undefined
        ? {
            dietTags: {
              deleteMany: {},
              create: dietTagIds.map((dietTagId) => ({ dietTagId })),
            },
          }
        : {}),
    },
    include: { dietTags: { include: { dietTag: true } } },
  });

  return NextResponse.json({ listing });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (existing.cookId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
