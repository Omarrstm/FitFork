"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
