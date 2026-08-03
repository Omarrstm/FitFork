import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <p className="text-green-400 font-mono text-sm mb-4 tracking-widest uppercase">
        404
      </p>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
        This plate&apos;s empty
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        We couldn&apos;t find what you were looking for. It may have been
        removed, or the link might be off.
      </p>
      <Link
        href="/browse"
        className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all"
      >
        Browse Meals
      </Link>
    </div>
  );
}
