import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteListingButton from "@/components/DeleteListingButton";
import OrderStatusControl from "@/components/OrderStatusControl";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const [listings, incomingOrders] = await Promise.all([
    prisma.listing.findMany({
      where: { cookId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { listing: { cookId: session.user.id } },
      include: { listing: true, buyer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Your Listings
        </h1>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all"
        >
          New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          You haven&apos;t listed any meals yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {listing.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                ${listing.price.toString()} · {listing.servings} servings ·{" "}
                {listing.city}
              </p>
              <div className="flex gap-4">
                <Link
                  href={`/dashboard/${listing.id}/edit`}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Edit
                </Link>
                <DeleteListingButton listingId={listing.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Incoming Orders
      </h2>
      {incomingOrders.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {incomingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {order.listing.title} × {order.quantity}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  from {order.buyer.name}
                </p>
              </div>
              <OrderStatusControl orderId={order.id} status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
