import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { listingSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const dietTags = searchParams.getAll("dietTag");
  const minProtein = searchParams.get("minProtein");
  const maxCalories = searchParams.get("maxCalories");
  const mine = searchParams.get("mine");

  const session = await auth();

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      ...(mine === "true" && session?.user
        ? { cookId: session.user.id }
        : {}),
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(minProtein ? { protein: { gte: Number(minProtein) } } : {}),
      ...(maxCalories ? { calories: { lte: Number(maxCalories) } } : {}),
      ...(dietTags.length > 0
        ? { dietTags: { some: { dietTag: { name: { in: dietTags } } } } }
        : {}),
    },
    include: {
      cook: { select: { id: true, name: true, city: true } },
      dietTags: { include: { dietTag: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = listingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { dietTagIds, ...data } = parsed.data;

  const listing = await prisma.listing.create({
    data: {
      ...data,
      cookId: session.user.id,
      dietTags: {
        create: dietTagIds.map((dietTagId) => ({ dietTagId })),
      },
    },
    include: { dietTags: { include: { dietTag: true } } },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
