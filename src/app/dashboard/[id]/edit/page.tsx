import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ListingForm from "@/components/ListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { dietTags: true },
  });

  if (!listing) notFound();
  if (listing.cookId !== session.user.id) redirect("/dashboard");

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        Edit Listing
      </h1>
      <ListingForm
        listingId={listing.id}
        initial={{
          title: listing.title,
          description: listing.description,
          imageUrl: listing.imageUrl,
          price: listing.price.toNumber(),
          servings: listing.servings,
          calories: listing.calories,
          protein: listing.protein,
          carbs: listing.carbs,
          fat: listing.fat,
          city: listing.city,
          dietTagIds: listing.dietTags.map((t) => t.dietTagId),
        }}
      />
    </div>
  );
}
