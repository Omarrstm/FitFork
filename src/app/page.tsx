import Link from "next/link";
import CinematicHero from "@/components/CinematicHero";

const features = [
  {
    title: "Macro-tracked",
    description:
      "Every meal lists calories, protein, carbs, and fat up front — no guessing.",
  },
  {
    title: "Home-cooked",
    description:
      "Real meals from real cooks in your area, not another restaurant chain.",
  },
  {
    title: "Diet-friendly",
    description:
      "Filter by vegan, keto, halal, gluten-free, high-protein, and more.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <CinematicHero />
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <p className="text-green-400 font-mono text-sm mb-4 tracking-widest uppercase">
            Home-cooked, tracked to the macro
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white">
            Meals that fit your macros,
            <br />
            made by real cooks.
          </h1>
          <p className="max-w-xl mx-auto text-zinc-300 text-lg leading-relaxed mb-10">
            FitFork connects home cooks with buyers who care about what&apos;s
            in their food — browse by calories, protein, carbs, and diet, then
            order straight from the kitchen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/browse"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-200"
            >
              Browse Meals
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 rounded-2xl border border-white/20 text-white font-medium hover:border-green-400 hover:bg-white/5 transition-all duration-200"
            >
              Become a Cook
            </Link>
          </div>
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 pb-28 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700/50"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
