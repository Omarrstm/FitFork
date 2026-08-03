"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function ReviewForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, rating, comment: comment || undefined }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-green-600 dark:text-green-400 hover:underline"
      >
        Leave a review
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >
            {n <= (hovered || rating) ? (
              <HiStar size={22} className="text-orange-400" />
            ) : (
              <HiOutlineStar size={22} className="text-zinc-400 dark:text-zinc-500" />
            )}
          </button>
        ))}
      </div>
      <textarea
        aria-label="Review comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment..."
        rows={2}
        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-600 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-1.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
