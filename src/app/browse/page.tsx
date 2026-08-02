"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";

type DietTag = { id: string; name: string };
type Listing = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  city: string;
  cook: { name: string };
  dietTags: { dietTag: { name: string } }[];
};

export default function BrowsePage() {
  const [dietTagOptions, setDietTagOptions] = useState<DietTag[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minProtein, setMinProtein] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

  useEffect(() => {
    fetch("/api/diet-tags")
      .then((res) => res.json())
      .then((data) => setDietTagOptions(data.dietTags ?? []));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (minProtein) params.set("minProtein", minProtein);
    if (maxCalories) params.set("maxCalories", maxCalories);
    selectedTags.forEach((tag) => params.append("dietTag", tag));

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/listings?${params.toString()}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setListings(data.listings ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, city, selectedTags, minProtein, maxCalories]);

  function toggleTag(name: string) {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  const inputClass =
    "px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        Browse Meals
      </h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} flex-1 min-w-[200px]`}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${inputClass} w-40`}
        />
        <input
          type="number"
          placeholder="Min protein (g)"
          value={minProtein}
          onChange={(e) => setMinProtein(e.target.value)}
          className={`${inputClass} w-40`}
        />
        <input
          type="number"
          placeholder="Max calories"
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
          className={`${inputClass} w-40`}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {dietTagOptions.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.name)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selectedTags.includes(tag.name)
                ? "bg-green-600 text-white border-green-600"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-green-400"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No meals match your filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
