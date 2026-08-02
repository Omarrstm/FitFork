import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const DIET_TAGS = [
  "Vegan",
  "Vegetarian",
  "Keto",
  "Halal",
  "Gluten-Free",
  "High-Protein",
  "Low-Carb",
  "Dairy-Free",
];

async function main() {
  for (const name of DIET_TAGS) {
    await prisma.dietTag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${DIET_TAGS.length} diet tags.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
