import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import OrderButton from "@/components/OrderButton";
import StarRating from "@/components/StarRating";

const getListing = cache(async (id: string) => {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      cook: { select: { id: true, name: true, city: true, bio: true } },
      dietTags: { include: { dietTag: true } },
      reviews: {
        include: { buyer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing || !listing.isActive) {
    return { title: "Listing not found — FitFork" };
  }

  const title = `${listing.title} — FitFork`;
  const description = `${listing.calories} cal · ${listing.protein}g protein per serving, by ${listing.cook.name} in ${listing.city}. ${listing.description}`.slice(
    0,
    200
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: listing.imageUrl ? [{ url: listing.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: listing.imageUrl ? [listing.imageUrl] : undefined,
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const listing = await getListing(id);

  if (!listing || !listing.isActive) notFound();

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

  const macros = [
    ["Calories", listing.calories],
    ["Protein", `${listing.protein}g`],
    ["Carbs", `${listing.carbs}g`],
    ["Fat", `${listing.fat}g`],
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden">
          {listing.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              No photo
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
            {listing.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-2">
            by {listing.cook.name} · {listing.city}
          </p>

          {avgRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={avgRating} />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {avgRating.toFixed(1)} ({listing.reviews.length} review
                {listing.reviews.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-6">
            ${listing.price.toString()}{" "}
            <span className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
              per serving
            </span>
          </p>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {macros.map(([label, value]) => (
              <div
                key={label}
                className="text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl py-3"
              >
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>

          {listing.dietTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {listing.dietTags.map(({ dietTag }) => (
                <span
                  key={dietTag.name}
                  className="text-xs px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                >
                  {dietTag.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            {listing.description}
          </p>

          <OrderButton
            listingId={listing.id}
            price={listing.price.toNumber()}
            servingsAvailable={listing.servings}
            isOwnListing={session?.user?.id === listing.cookId}
          />
        </div>
      </div>

      {listing.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Reviews
          </h2>
          <div className="space-y-4">
            {listing.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {review.buyer.name}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
