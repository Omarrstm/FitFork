"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <p className="text-orange-400 font-mono text-sm mb-4 tracking-widest uppercase">
        Kitchen mishap
      </p>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
        Something went wrong
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        An unexpected error occurred. Give it another try, or head back to the
        homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
