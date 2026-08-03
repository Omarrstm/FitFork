import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= rounded ? (
          <HiStar key={n} size={size} className="text-orange-400" />
        ) : (
          <HiOutlineStar key={n} size={size} className="text-zinc-400 dark:text-zinc-600" />
        )
      )}
    </div>
  );
}
