# Style Profiler

A web app for narrowing down a client's interior-design & architecture taste. You curate a tagged image library; clients swipe thumbs-up / thumbs-down through a deck; the app builds a weighted style profile from what they loved and saves it to your dashboard.

## How it works

- **You (designer)** sign in, build an image **Library** (paste URLs or upload from your Pinterest board), and tag each image with styles + attributes.
- You create a **shareable link** per client from the **Dashboard** and send it to them.
- **Your client** opens the link (no login), rates ~30 images, and gets an instant style profile.
- The completed **profile** appears on your Dashboard, with bar-chart style breakdowns, a gallery of liked images, and a downloadable / printable report.

## Non-technical setup

If you just want to get this online without touching a terminal, follow **HOSTING-GUIDE.md** — a plain-language, click-by-click walkthrough (GitHub → Neon → Vercel).

## Run locally (developers)

Requires Node 18+ and a Postgres connection string (e.g. a free Neon database).

```bash
npm install
cp .env.example .env        # set DATABASE_URL and ADMIN_PASSWORD
npm run setup               # pushes the schema + seeds 12 sample images
npm run dev                 # http://localhost:3000
```

Sign in at `/login` with the `ADMIN_PASSWORD` you set. Replace the sample images in **Library**.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Create a free Postgres database (e.g. **Neon**) and copy its connection string.
3. Import the repo into Vercel and set two environment variables:
   - `DATABASE_URL` = your Postgres connection string
   - `ADMIN_PASSWORD` = a password only you know
4. Deploy. The build runs `prisma generate && prisma db push`, so tables are created automatically — no manual migration step.
5. After it's live, sign in and click **Load 12 sample images** in the Library (or add your own).

## Notes & next steps

- **Auth** is a single shared password (fine for one designer). For multiple team members, add a real auth provider.
- **Uploaded images** are stored in the database as data URLs — simple and works on Vercel. For a large library, switch uploads to blob storage (Vercel Blob / S3) and store just the URL.
- **Profile engine** lives in `lib/styles.js`: liked images add weight, dislikes subtract a little, scores are normalised to percentages. Tune the weights there.
- Style/attribute taxonomies are also in `lib/styles.js` — edit the lists to match your vocabulary.

## Project structure

```
app/
  api/            REST endpoints (login, images, sessions, results, settings)
  dashboard/      designer: links + saved profiles
  admin/          image library management
  r/[token]/      public client rating flow
  results/[id]/   profile + report
lib/
  db.js           Prisma client
  styles.js       taxonomy + profile engine
  auth.js         password gate
prisma/
  schema.prisma   data model
  seed.mjs        sample library
middleware.js     protects /dashboard and /admin
```
