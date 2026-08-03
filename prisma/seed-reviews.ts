import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const DEMO_PASSWORD = "Demo1234!";

async function upsertBuyer(email: string, name: string, city: string) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, city, passwordHash },
  });
}

type Seed = {
  listingTitle: string;
  buyerEmail: string;
  quantity: number;
  rating: number;
  comment: string;
};

async function main() {
  const ayse = await upsertBuyer("ayse@demo.fitfork", "Ayse Celik", "Istanbul");
  const burak = await upsertBuyer("burak@demo.fitfork", "Burak Sahin", "Ankara");
  const zeynep = await upsertBuyer("zeynep@demo.fitfork", "Zeynep Arslan", "Izmir");

  const buyers: Record<string, { id: string }> = {
    "ayse@demo.fitfork": ayse,
    "burak@demo.fitfork": burak,
    "zeynep@demo.fitfork": zeynep,
  };

  const seeds: Seed[] = [
    {
      listingTitle: "Grilled Chicken & Quinoa Bowl",
      buyerEmail: "ayse@demo.fitfork",
      quantity: 2,
      rating: 5,
      comment: "Perfectly seasoned and so filling, exactly the macros I needed post-workout.",
    },
    {
      listingTitle: "Grilled Chicken & Quinoa Bowl",
      buyerEmail: "burak@demo.fitfork",
      quantity: 1,
      rating: 4,
      comment: "Great bowl, a little light on the chicken portion for me but tasted great.",
    },
    {
      listingTitle: "Turkey Meatballs & Sweet Potato Mash",
      buyerEmail: "zeynep@demo.fitfork",
      quantity: 1,
      rating: 5,
      comment: "The sweet potato mash is incredible, will order every week.",
    },
    {
      listingTitle: "Keto Salmon Plate",
      buyerEmail: "ayse@demo.fitfork",
      quantity: 1,
      rating: 5,
      comment: "Salmon was cooked perfectly, real keto-friendly portion.",
    },
    {
      listingTitle: "Keto Salmon Plate",
      buyerEmail: "zeynep@demo.fitfork",
      quantity: 1,
      rating: 4,
      comment: "Tasty and satisfying, would love a bit more asparagus.",
    },
    {
      listingTitle: "Mediterranean Chickpea Salad",
      buyerEmail: "burak@demo.fitfork",
      quantity: 2,
      rating: 4,
      comment: "Fresh and light, great for lunch.",
    },
    {
      listingTitle: "Overnight Oats Protein Bowl",
      buyerEmail: "ayse@demo.fitfork",
      quantity: 3,
      rating: 5,
      comment: "Perfect grab-and-go breakfast, kept me full till noon.",
    },
    {
      listingTitle: "Lentil & Spinach Soup",
      buyerEmail: "burak@demo.fitfork",
      quantity: 2,
      rating: 4,
      comment: "Comforting and healthy, could use a touch more salt.",
    },
    {
      listingTitle: "Vegan Buddha Bowl",
      buyerEmail: "ayse@demo.fitfork",
      quantity: 1,
      rating: 5,
      comment: "So fresh and colorful, the tahini sauce makes it.",
    },
    {
      listingTitle: "Vegan Buddha Bowl",
      buyerEmail: "zeynep@demo.fitfork",
      quantity: 1,
      rating: 3,
      comment: "Good but a bit small for the price.",
    },
    {
      listingTitle: "Halal Beef Stir-Fry",
      buyerEmail: "burak@demo.fitfork",
      quantity: 1,
      rating: 5,
      comment: "Best halal stir-fry I've had delivered, generous portion.",
    },
  ];

  let created = 0;
  for (const seed of seeds) {
    const listing = await prisma.listing.findFirst({
      where: { title: seed.listingTitle },
    });
    if (!listing) {
      console.warn(`Listing not found: ${seed.listingTitle}`);
      continue;
    }

    const buyer = buyers[seed.buyerEmail];

    const existingOrder = await prisma.order.findFirst({
      where: { listingId: listing.id, buyerId: buyer.id },
    });
    if (existingOrder) continue;

    const totalPrice = listing.price.mul(seed.quantity);

    const order = await prisma.order.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        quantity: seed.quantity,
        totalPrice,
        status: "COMPLETED",
      },
    });

    await prisma.review.create({
      data: {
        orderId: order.id,
        listingId: listing.id,
        buyerId: buyer.id,
        rating: seed.rating,
        comment: seed.comment,
      },
    });

    created += 1;
  }

  console.log(`Seeded ${created} demo order(s) with reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
