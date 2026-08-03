"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OrderButton({
  listingId,
  price,
  servingsAvailable,
  isOwnListing,
}: {
  listingId: string;
  price: number;
  servingsAvailable: number;
  isOwnListing: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (isOwnListing) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This is your own listing.
      </p>
    );
  }

  if (status !== "authenticated") {
    return (
      <Link
        href="/auth/signin"
        className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all"
      >
        Sign in to order
      </Link>
    );
  }

  if (success) {
    return (
      <p className="text-green-600 dark:text-green-400 font-medium">
        Order placed! Track it on{" "}
        <Link href="/orders" className="underline">
          My Orders
        </Link>
        .
      </p>
    );
  }

  async function handleOrder() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, quantity }),
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="quantity" className="text-sm text-zinc-600 dark:text-zinc-400">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={servingsAvailable}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Math.min(servingsAvailable, Number(e.target.value))))
          }
          className="w-20 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          of {servingsAvailable} available
        </span>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleOrder}
        disabled={loading}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
      >
        {loading ? "Placing order..." : `Place Order · $${(price * quantity).toFixed(2)}`}
      </button>
    </div>
  );
}
