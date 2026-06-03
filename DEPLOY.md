# 🚀 EmmzyVisuals — Deployment & Setup Guide

## Step 1 — Clone & Install

```bash
git clone <your-repo-url> emmzyvisuals
cd emmzyvisuals
npm install
```

---

## Step 2 — Database Setup (Neon — recommended free tier)

1. Go to [neon.tech](https://neon.tech) and create a free project
2. Enable the **pgvector** extension in the Neon console:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Copy the connection strings into your `.env.local`

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and DIRECT_URL from Neon
```

---

## Step 3 — Configure All Environment Variables

Open `.env.local` and fill in:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Neon dashboard → Connection string |
| `DIRECT_URL` | Same as above (for Prisma migrations) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |
| `UPLOADTHING_SECRET` | [uploadthing.com](https://uploadthing.com) |
| `UPLOADTHING_APP_ID` | Same dashboard |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Your domain (e.g. `https://ememzyvisuals.com`) |

---

## Step 4 — Run Migrations & Seed

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (projects + knowledge base)
npm run db:seed
```

---

## Step 5 — Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Step 6 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**In the Vercel dashboard:**
- Add all environment variables from `.env.local`
- Set `NEXTAUTH_URL` to your production URL
- Set `NEXT_PUBLIC_APP_URL` to your production URL

---

## Step 7 — Add Your OG Image

Create a 1200×630px image and place it at:
```
public/og/og-image.png
```

This image will appear when your URL is pasted into X/Twitter, LinkedIn, WhatsApp, Discord, etc.

---

## Step 8 — Add Project Screenshots

Once you have screenshots, update `data/projects.ts`:

```typescript
{
  slug: "claudgpt",
  coverImage: "/images/claudgpt-preview.png",   // landscape 16:9
  webImages: ["/images/claudgpt-web-1.png"],
  mobileImages: ["/images/claudgpt-mobile-1.png"],
  ...
}
```

Or upload via Prisma Studio:
```bash
npx prisma studio
# Open http://localhost:5555
# Edit Project records directly
```

---

## Step 9 — Moderate Reviews

Reviews submitted via the form go into the database with `status: "PENDING"`.

To approve them:
```bash
npx prisma studio
# Find the Review, set status to "APPROVED"
```

Or build an admin panel route at `/admin` using NextAuth.js (the schema is ready).

---

## How to Add New Content

### New Project
```bash
npx prisma studio
# Go to Project model → Add record
```

### New Blog Post
```bash
npx prisma studio
# Go to Blog model → Add record with markdown content
```

### New Gallery Image
```bash
# Upload via UploadThing, get URL
npx prisma studio
# Go to Gallery model → Add record with imageUrl
```

---

## SEO Checklist

- [x] `metadataBase` configured in `app/layout.tsx`
- [x] Per-page `title` and `description` metadata
- [x] Open Graph tags on every page
- [x] Twitter card metadata
- [x] `sitemap.xml` auto-generated at `/sitemap.xml`
- [x] `robots.txt` at `/robots.txt`
- [x] JSON-LD Person + WebSite schema in `<head>`
- [x] Canonical URLs on every page
- [ ] Add your OG image at `public/og/og-image.png`
- [ ] Submit sitemap to Google Search Console
- [ ] Verify site ownership in Google Search Console

---

## Architecture Summary

```
Browser → Vercel Edge → Next.js App Router
                              │
              ┌───────────────┼──────────────────┐
              │               │                  │
          Static Pages    API Routes        Server Actions
          (SSG + ISR)    /api/chat          contact.ts
                         /api/contact
                         /api/reviews
                              │
                         Groq API (AI)
                         Neon PostgreSQL
                         Resend (email)
```
