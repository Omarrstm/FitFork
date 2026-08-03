import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const { welcome } = await searchParams;
  const isWelcome = welcome === "1";

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {isWelcome && (
        <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
          <p className="font-semibold text-white mb-2">
            Welcome to FitFork! Let&apos;s list your first meal.
          </p>
          <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
            <li>A clear photo of the finished dish helps buyers trust the listing</li>
            <li>Accurate macros matter most here — measure per serving if you can</li>
            <li>Tag the diets it fits (vegan, keto, halal, etc.) so the right buyers find it</li>
          </ul>
        </div>
      )}

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        New Listing
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Share a home-cooked meal with its full macro breakdown.
      </p>
      <ListingForm />
    </div>
  );
}
