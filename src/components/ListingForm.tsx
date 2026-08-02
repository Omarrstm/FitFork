"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DietTag = { id: string; name: string };

type ListingFormValues = {
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  city: string;
  dietTagIds: string[];
};

export default function ListingForm({
  initial,
  listingId,
}: {
  initial?: Partial<ListingFormValues>;
  listingId?: string;
}) {
  const router = useRouter();
  const [dietTags, setDietTags] = useState<DietTag[]>([]);
  const [values, setValues] = useState<ListingFormValues>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? null,
    price: initial?.price ?? 0,
    servings: initial?.servings ?? 1,
    calories: initial?.calories ?? 0,
    protein: initial?.protein ?? 0,
    carbs: initial?.carbs ?? 0,
    fat: initial?.fat ?? 0,
    city: initial?.city ?? "",
    dietTagIds: initial?.dietTagIds ?? [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.imageUrl ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/diet-tags")
      .then((res) => res.json())
      .then((data) => setDietTags(data.dietTags ?? []));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function toggleDietTag(id: string) {
    setValues((prev) => ({
      ...prev,
      dietTagIds: prev.dietTagIds.includes(id)
        ? prev.dietTagIds.filter((tagId) => tagId !== id)
        : [...prev.dietTagIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = values.imageUrl;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");
        imageUrl = uploadData.url;
      }

      const payload = { ...values, imageUrl };
      const url = listingId ? `/api/listings/${listingId}` : "/api/listings";
      const method = listingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Photo</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="mt-3 w-full max-w-xs h-48 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input
            type="number"
            required
            min={0.01}
            step={0.01}
            value={values.price}
            onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Servings available</label>
          <input
            type="number"
            required
            min={1}
            step={1}
            value={values.servings}
            onChange={(e) => setValues({ ...values, servings: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>City</label>
        <input
          type="text"
          required
          value={values.city}
          onChange={(e) => setValues({ ...values, city: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <p className={labelClass}>Macros (per serving)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(
            [
              ["calories", "Calories"],
              ["protein", "Protein (g)"],
              ["carbs", "Carbs (g)"],
              ["fat", "Fat (g)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                {label}
              </label>
              <input
                type="number"
                required
                min={0}
                step={1}
                value={values[key]}
                onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={labelClass}>Diet tags</p>
        <div className="flex flex-wrap gap-2">
          {dietTags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => toggleDietTag(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                values.dietTagIds.includes(tag.id)
                  ? "bg-green-600 text-white border-green-600"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-green-400"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
      >
        {loading ? "Saving..." : listingId ? "Save Changes" : "Create Listing"}
      </button>
    </form>
  );
}
