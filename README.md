# EmmzyVisuals — Production Portfolio Platform

**Emmanuel Ariyo (Ememzyvisuals)** — Creative Software Developer & AI Systems Engineer

---

## ⚡ Architecture Overview

### Technology Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | ISR, Server Components, file-based routing, edge-ready |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS + CSS Variables | Utility-first, consistent design tokens |
| Animation | Framer Motion | Production-grade spring animations |
| ORM | Prisma | Type-safe DB access, schema migrations |
| Database | PostgreSQL + pgvector | Relational data + vector similarity search |
| AI | Groq API (LLaMA/Mixtral) | Ultra-fast inference for the chat system |
| Embeddings | Groq + pgvector | Semantic search for RAG pipeline |
| Media | UploadThing | Type-safe file uploads, S3-backed |
| Email | Resend | Transactional email for contact form |
| Auth | NextAuth.js | Admin panel protection |
| Deployment | Vercel | Edge network, ISR support, zero-config |

---

## 📁 Complete Folder Structure

```
emmzyvisuals/
├── app/
│   ├── (routes)/
│   │   ├── work/page.tsx
│   │   ├── automation/page.tsx
│   │   ├── benchmarks/page.tsx
│   │   ├── platforms/page.tsx
│   │   ├── blogs/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── ask-about-me/page.tsx
│   │   ├── project/[slug]/page.tsx
│   │   └── blog/[slug]/page.tsx
│   ├── api/
│   │   ├── chat/route.ts          — AI chat (RAG + Groq)
│   │   ├── contact/route.ts       — Contact form handler
│   │   ├── projects/route.ts      — Projects CRUD
│   │   ├── blogs/route.ts         — Blogs CRUD
│   │   ├── reviews/route.ts       — Reviews + moderation
│   │   ├── gallery/route.ts       — Gallery management
│   │   └── upload/route.ts        — UploadThing handler
│   ├── globals.css
│   ├── layout.tsx                 — Root layout + metadata
│   ├── page.tsx                   — Home (hero + all sections)
│   ├── sitemap.ts                 — Dynamic sitemap
│   ├── robots.ts                  — Robots config
│   └── manifest.ts                — PWA manifest
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             — Floating pill navigation
│   │   ├── Footer.tsx             — Minimal editorial footer
│   │   └── MobileMenu.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ProjectsGrid.tsx
│   │   ├── Automation.tsx
│   │   ├── Benchmarks.tsx
│   │   ├── Stack.tsx
│   │   ├── BlogPosts.tsx
│   │   ├── Gallery.tsx
│   │   ├── AskAboutMe.tsx         — AI chat UI
│   │   ├── Reviews.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── ProjectCard.tsx
│   │   ├── IPhoneMockup.tsx       — iPhone 17 Pro frame
│   │   ├── LaptopMockup.tsx
│   │   ├── TechBadge.tsx
│   │   ├── SectionHeader.tsx
│   │   └── AvailableBadge.tsx
│   └── providers/
│       └── ThemeProvider.tsx
│
├── lib/
│   ├── prisma.ts                  — Prisma singleton
│   ├── groq.ts                    — Groq client + helpers
│   ├── embeddings.ts              — Vector embedding pipeline
│   ├── rag.ts                     — RAG retrieval system
│   ├── utils.ts                   — General utilities
│   ├── metadata.ts                — SEO metadata helpers
│   └── uploadthing.ts             — UploadThing config
│
├── actions/
│   ├── contact.ts                 — Server actions: contact form
│   └── reviews.ts                 — Server actions: review submission
│
├── hooks/
│   ├── useActiveSection.ts
│   └── useScrollDirection.ts
│
├── data/
│   ├── projects.ts                — Static project seed data
│   ├── stack.ts                   — Tech stack categories
│   ├── automation.ts              — Automation project data
│   └── contextChunks.ts           — AI knowledge base chunks
│
├── types/
│   └── index.ts                   — All TypeScript types
│
├── config/
│   ├── site.ts                    — Site-wide config & constants
│   └── navigation.ts              — Nav items config
│
├── prisma/
│   └── schema.prisma              — Full database schema
│
├── public/
│   ├── og/
│   │   └── og-image.png           — Default OG preview image
│   └── images/
│
├── styles/
│   └── fonts.css
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔄 Rendering Strategy

| Route | Strategy | Why |
|-------|----------|-----|
| `/` | SSG + ISR (60s) | Fast home page, refreshes content |
| `/work` | SSG + ISR | Project list, updates when DB changes |
| `/project/[slug]` | SSG + ISR | Individual project pages |
| `/blogs` | SSG + ISR | Blog listing |
| `/blog/[slug]` | SSG + ISR | Individual blog post |
| `/ask-about-me` | Client Component | Real-time chat |
| `/contact` | Server Action | Form submission |
| `/api/*` | Edge Runtime | Fast API responses |

---

## 🤖 AI RAG Architecture

```
User Question
      │
      ▼
┌─────────────────┐
│  Embed Query    │  (Groq embedding or text-embedding-3-small)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  pgvector       │  SELECT ... ORDER BY embedding <=> $1 LIMIT 5
│  Similarity     │
│  Search         │
└────────┬────────┘
         │ Top-K chunks
         ▼
┌─────────────────┐
│  Format         │  System prompt + retrieved context + user query
│  Context        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Groq API       │  llama-3.3-70b-versatile
│  (streaming)    │
└────────┬────────┘
         │
         ▼
   Streamed Response
```

**Knowledge Base chunks** are generated from:
- Bio & philosophy text
- Each project's title, description, tech stack, and impact
- Blog post summaries
- Benchmark descriptions
- Stack expertise

---

## 🔍 SEO Architecture

Every page gets:
- `metadataBase` set to production URL
- `title` with template (`Page | Ememzyvisuals`)
- `description` (unique per page)
- `openGraph` with `title`, `description`, `images`, `type`
- `twitter` card with `summary_large_image`
- `canonical` URL
- JSON-LD structured data (Person, WebSite, CreativeWork schemas)
- `keywords` and `authors`

Rich previews on:
- **X/Twitter** — `twitter:card` + `twitter:image`
- **LinkedIn** — Open Graph
- **WhatsApp** — Open Graph
- **Discord** — Open Graph
- **Facebook** — Full OG tags
- **Telegram** — Open Graph

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repo>
cd emmzyvisuals
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in all values

# 3. Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Run dev
npm run dev
```

---

## ☁️ Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables (set in Vercel dashboard):
DATABASE_URL
DIRECT_URL
GROQ_API_KEY
NEXTAUTH_SECRET
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

For PostgreSQL, use **Vercel Postgres** or **Neon** (both support pgvector).

---

## 📦 Add Content

**Add a project**: Insert into `projects` table via Prisma Studio (`npx prisma studio`)

**Add a blog**: Create entry in `blogs` table with markdown content

**Add gallery image**: Upload via `/api/upload`, creates `gallery` record

**Moderate reviews**: Set `approved: true` in the `reviews` table
