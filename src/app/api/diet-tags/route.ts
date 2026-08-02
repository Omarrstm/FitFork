import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dietTags = await prisma.dietTag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ dietTags });
}
