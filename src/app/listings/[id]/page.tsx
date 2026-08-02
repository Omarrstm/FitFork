import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import OrderButton from "@/components/OrderButton";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      cook: { select: { id: true, name: true, city: true, bio: true } },
      dietTags: { include: { dietTag: true } },
    },
  });

  if (!listing || !listing.isActive) notFound();

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
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            by {listing.cook.name} · {listing.city}
          </p>
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
    </div>
  );
}
