import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewForm from "@/components/ReviewForm";
import StarRating from "@/components/StarRating";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
  CONFIRMED: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  COMPLETED: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: { include: { cook: { select: { name: true } } } },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No orders yet.{" "}
          <Link href="/browse" className="text-green-600 dark:text-green-400 underline">
            Browse meals
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Link
                    href={`/listings/${order.listingId}`}
                    className="font-medium text-zinc-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  >
                    {order.listing.title}
                  </Link>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    × {order.quantity} · ${order.totalPrice.toString()} · from{" "}
                    {order.listing.cook.name}
                  </p>
                </div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-full whitespace-nowrap ${
                    STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.status === "COMPLETED" && (
                <div className="mt-3">
                  {order.review ? (
                    <div className="flex items-center gap-2">
                      <StarRating rating={order.review.rating} />
                      {order.review.comment && (
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          &ldquo;{order.review.comment}&rdquo;
                        </span>
                      )}
                    </div>
                  ) : (
                    <ReviewForm orderId={order.id} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
