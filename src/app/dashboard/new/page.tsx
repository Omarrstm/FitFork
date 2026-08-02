import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
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
