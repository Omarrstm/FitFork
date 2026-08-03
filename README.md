# FitFork

A marketplace connecting home cooks with buyers who care about their macros.
Cooks list home-cooked meals with a full nutrition breakdown (calories,
protein, carbs, fat) and diet tags (vegan, keto, halal, gluten-free, etc.);
buyers browse, filter, and place orders.

Live: https://fitfork-ochre.vercel.app

<!-- Add screenshots here: landing page, browse grid, listing detail, cook dashboard -->

The live site is seeded with demo listings from 4 cooks (`prisma/seed-demo.ts`)
so `/browse` isn't empty. To sign in as one of the demo cooks and try the
dashboard (create/edit listings, manage incoming orders), use:

- `elif@demo.fitfork` / `mert@demo.fitfork` / `asli@demo.fitfork` / `deniz@demo.fitfork`
- password: `Demo1234!`

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Prisma ORM + PostgreSQL**, using Prisma 7's driver-adapter API (`@prisma/adapter-pg`)
- **NextAuth (Auth.js) v5** — Credentials provider, JWT sessions
- **Vercel Blob** for listing photo uploads
- **Zod** for API input validation
- Deployed on **Vercel**

## Features

- Auth: email/password signup and login (any account can act as both a cook
  and a buyer)
- Cooks: create/edit/delete listings with macros, diet tags, price,
  servings, city, and a photo upload
- Buyers: browse with live filters (search, city, min protein, max
  calories, diet tags), view full listing detail, place an order
- Orders: a real status lifecycle (`PENDING -> CONFIRMED -> COMPLETED`, or
  `CANCELLED`) enforced server-side via an explicit transition table, with a
  buyer order-history view and a cook incoming-orders dashboard

## Running locally

```bash
npm install
npx prisma migrate dev   # applies the schema to your DATABASE_URL
npx prisma db seed       # seeds diet tags
npm run dev
```

You'll need a `.env` with:

```
DATABASE_URL=postgres://...
AUTH_SECRET=...           # generate with: openssl rand -base64 32
BLOB_READ_WRITE_TOKEN=... # from a Vercel Blob store, for photo uploads
```

## Notes

This is scoped as a portfolio project, not a production marketplace:
checkout is simulated (no real payment processing), and location is a plain
city text field rather than geolocation/delivery logistics.
