"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STATUSES: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
  CONFIRMED: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  COMPLETED: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400",
};

export default function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(next: string) {
    setLoading(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  }

  const options = NEXT_STATUSES[status] ?? [];

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-mono px-3 py-1 rounded-full whitespace-nowrap ${
          STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
        }`}
      >
        {status}
      </span>
      {options.map((next) => (
        <button
          key={next}
          onClick={() => updateStatus(next)}
          disabled={loading}
          className="text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
        >
          Mark {next.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
