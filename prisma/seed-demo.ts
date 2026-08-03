import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const DEMO_PASSWORD = "Demo1234!";

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/600`;
}

async function getTagIds(names: string[]) {
  const tags = await prisma.dietTag.findMany({ where: { name: { in: names } } });
  return tags.map((t) => t.id);
}

async function upsertCook(email: string, name: string, city: string) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, city, passwordHash },
  });
}

async function main() {
  const elif = await upsertCook("elif@demo.fitfork", "Elif Yilmaz", "Istanbul");
  const mert = await upsertCook("mert@demo.fitfork", "Mert Demir", "Ankara");
  const asli = await upsertCook("asli@demo.fitfork", "Asli Kaya", "Izmir");
  const deniz = await upsertCook("deniz@demo.fitfork", "Deniz Aydin", "Istanbul");

  const listings = [
    {
      cookId: elif.id,
      title: "Grilled Chicken & Quinoa Bowl",
      description:
        "Grilled chicken breast over quinoa with roasted vegetables and a lemon-herb dressing. Meal-prepped for the week.",
      city: "Istanbul",
      price: 9.5,
      servings: 6,
      calories: 520,
      protein: 42,
      carbs: 48,
      fat: 14,
      tags: ["High-Protein", "Low-Carb"],
      img: "chicken-quinoa",
    },
    {
      cookId: elif.id,
      title: "Turkey Meatballs & Sweet Potato Mash",
      description:
        "Lean turkey meatballs with a herby tomato sauce, served over creamy sweet potato mash.",
      city: "Istanbul",
      price: 8.75,
      servings: 5,
      calories: 480,
      protein: 38,
      carbs: 44,
      fat: 15,
      tags: ["High-Protein", "Gluten-Free"],
      img: "turkey-meatballs",
    },
    {
      cookId: mert.id,
      title: "Keto Salmon Plate",
      description:
        "Pan-seared salmon with garlic butter asparagus and cauliflower rice. Zero-carb, high-fat, high-protein.",
      city: "Ankara",
      price: 12.0,
      servings: 4,
      calories: 610,
      protein: 40,
      carbs: 8,
      fat: 42,
      tags: ["Keto", "High-Protein", "Gluten-Free"],
      img: "keto-salmon",
    },
    {
      cookId: mert.id,
      title: "Mediterranean Chickpea Salad",
      description:
        "Chickpeas, cucumber, tomato, red onion, and parsley tossed in olive oil and lemon. Light and refreshing.",
      city: "Ankara",
      price: 6.5,
      servings: 6,
      calories: 340,
      protein: 14,
      carbs: 46,
      fat: 11,
      tags: ["Vegan", "Dairy-Free"],
      img: "chickpea-salad",
    },
    {
      cookId: asli.id,
      title: "Overnight Oats Protein Bowl",
      description:
        "Rolled oats soaked overnight with protein powder, chia seeds, and fresh berries. Great grab-and-go breakfast.",
      city: "Izmir",
      price: 5.0,
      servings: 7,
      calories: 380,
      protein: 28,
      carbs: 50,
      fat: 9,
      tags: ["Vegetarian", "High-Protein"],
      img: "overnight-oats",
    },
    {
      cookId: asli.id,
      title: "Lentil & Spinach Soup",
      description:
        "A hearty red lentil soup with spinach, cumin, and a squeeze of lemon. Comforting and filling.",
      city: "Izmir",
      price: 5.5,
      servings: 8,
      calories: 260,
      protein: 16,
      carbs: 38,
      fat: 4,
      tags: ["Vegan", "Low-Carb", "Gluten-Free"],
      img: "lentil-soup",
    },
    {
      cookId: deniz.id,
      title: "Vegan Buddha Bowl",
      description:
        "Roasted chickpeas, quinoa, avocado, and seasonal vegetables with a tahini drizzle.",
      city: "Istanbul",
      price: 8.0,
      servings: 5,
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 12,
      tags: ["Vegan", "Gluten-Free"],
      img: "buddha-bowl",
    },
    {
      cookId: deniz.id,
      title: "Halal Beef Stir-Fry",
      description:
        "Halal-certified beef strips stir-fried with broccoli, peppers, and a light soy-ginger sauce over rice.",
      city: "Istanbul",
      price: 10.5,
      servings: 5,
      calories: 560,
      protein: 36,
      carbs: 52,
      fat: 18,
      tags: ["Halal", "High-Protein"],
      img: "beef-stirfry",
    },
  ];

  for (const listing of listings) {
    const existing = await prisma.listing.findFirst({
      where: { title: listing.title, cookId: listing.cookId },
    });
    if (existing) continue;

    const dietTagIds = await getTagIds(listing.tags);

    await prisma.listing.create({
      data: {
        cookId: listing.cookId,
        title: listing.title,
        description: listing.description,
        imageUrl: img(listing.img),
        price: listing.price,
        servings: listing.servings,
        calories: listing.calories,
        protein: listing.protein,
        carbs: listing.carbs,
        fat: listing.fat,
        city: listing.city,
        dietTags: { create: dietTagIds.map((dietTagId) => ({ dietTagId })) },
      },
    });
  }

  console.log(`Seeded ${listings.length} demo listings across 4 cooks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
