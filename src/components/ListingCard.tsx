import Link from "next/link";

type ListingCardData = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  city: string;
  cook: { name: string };
  dietTags: { dietTag: { name: string } }[];
};

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col bg-white dark:bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-700/50 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg hover:shadow-green-500/5"
    >
      <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {listing.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
            No photo
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {listing.title}
          </h3>
          <span className="font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
            ${listing.price}
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          by {listing.cook.name} · {listing.city}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-3">
          <span>{listing.calories} cal</span>
          <span>·</span>
          <span>{listing.protein}g protein</span>
          <span>·</span>
          <span>{listing.carbs}g carbs</span>
          <span>·</span>
          <span>{listing.fat}g fat</span>
        </div>
        {listing.dietTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {listing.dietTags.map(({ dietTag }) => (
              <span
                key={dietTag.name}
                className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
              >
                {dietTag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
