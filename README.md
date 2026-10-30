# Ememzyvisuals — Production Portfolio Platform

**Emmanuel Ariyo (Ememzyvisuals)** — Creative Software Developer & AI Systems Engineer

Live at [ememzyvisuals.vercel.app](https://ememzyvisuals.vercel.app)

---

## ⚡ Actual Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14.2 (App Router) | Not v15 — pinned at 14 |
| Language | TypeScript | Strict mode |
| Runtime | React 18.3 | Deliberately NOT on React 19 — see note below |
| Styling | Tailwind CSS + CSS variables | Design tokens in `app/globals.css` |
| Animation | Framer Motion | Section reveals, the pet, hero transitions |
| 3D | Three.js + `@react-three/fiber@8` + `@react-three/drei@9` | React-18-compatible majors only — see warning below |
| Glass effect | Custom CSS (`.liquid-glass` in `globals.css`) | See "Liquid glass" section below |
| ORM | Prisma | Schema in `prisma/schema.prisma` |
| Database | PostgreSQL (Neon) | `DATABASE_URL` env var |
| AI Chat | Groq API | `lib/groq.ts`, streaming SSE, powers Ask About Me |
| Media hosting | Cloudinary | Images AND video, admin-configured (not an env var — see Gallery section) |
| Email | Resend | Contact form |
| Admin auth | Simple shared key via `?key=` query param | `NEXT_PUBLIC_ADMIN_KEY` — no NextAuth, no user accounts |
| Deployment | Vercel | Auto-deploys on push to `main` |

---

## ⚠️ Critical dependency note — READ BEFORE UPGRADING ANYTHING

This project runs **React 18.3**, not React 19, on purpose. Two packages here —
`liquid-glass-react` and (previously, until pinned) `@react-three/fiber` /
`@react-three/drei` — release major versions that **require React 19** and
will silently crash the entire site if their React-19-only majors get
installed under React 18.

- `@react-three/fiber` is pinned to `^8.18.0` and `@react-three/drei` to
  `^9.122.0` in `package.json` — these are the last majors that support
  React 18. **Do not run a bare `npm install @react-three/fiber` or
  `@react-three/drei`** without a version pin — npm will grab the latest
  major (v9/v10), which requires React 19, and the 3D canvas will crash on
  every mount with no useful error message.
- `liquid-glass-react` is installed but **is not currently used** — see the
  "Liquid glass" section below for why.
- `.npmrc` sets `legacy-peer-deps=true` so `npm install` on Vercel doesn't
  fail outright on the peer-dependency warnings these packages still emit
  even when pinned correctly.

If you ever see the whole site white-screen or black-screen in production
with no visible error, **check for a React-19-only package having been
installed under React 18** before anything else — it's happened twice in
this project's history already.

---

## 🪟 Liquid glass — CSS, not WebGL (for now)

An earlier version of this site used `liquid-glass-react` (a real WebGL
refraction/chromatic-aberration library) for the glass effect on the nav,
cards, and modals. It caused a full-page production crash (a broken
full-viewport canvas), so it was replaced with a pure-CSS implementation:

- `.liquid-glass` utility class in `app/globals.css` — `backdrop-filter`
  blur + saturate, plus an SVG `feDisplacementMap` distortion filter
  (defined inline in `app/layout.tsx`) for a subtle refraction feel.
- `.card-surface` (used by most cards site-wide) has this baked in.
- `components/ui/GlassPanel.tsx` is a wrapper that *can* switch to the real
  WebGL library — there's a `FORCE_CSS_FALLBACK` flag at the top of that
  file, currently `true`. Flipping it to `false` re-enables
  `liquid-glass-react`. **Do not do this without first checking whether a
  React-18-compatible version of that library exists** — as of this
  writing it required React 19 and broke the site immediately.
- **Important gotcha already hit once:** when a `GlassPanel` is given a
  custom `fallbackClassName` (e.g. a solid dark card), do NOT expect
  `.liquid-glass`'s own background to layer harmlessly underneath it — it
  can silently win the CSS cascade over a plain (non-`!important`)
  background utility and make the element blend invisibly into the page.
  Either give the custom fallback its own `!important`-forced background,
  or explicitly include `liquid-glass` in the fallback class string
  yourself if you want the blur.

---

## 🧍 3D Hero Figure

`components/three/Hero3D.tsx` + `components/three/HeroFigure.tsx` render a
`.glb` model (`public/models/hero-figure.glb`) behind the hero text.

- **Fully opaque on page load**, fading toward a subtle background presence
  as the user scrolls past the hero (same behavior on mobile and desktop).
- **Scroll-linked rotation**: faces to the side on load, eases to face
  forward as you scroll down.
- **Cursor tracking**: subtly turns toward the pointer.
- **Network-aware**: checks the Network Information API (where supported —
  not Safari) and skips rendering the canvas entirely on slow/data-saver
  connections. Browsers without the API get the 3D experience by default.
- Wrapped in `ErrorBoundary` with `fallback={null}` and `next/dynamic`
  (`ssr: false`) so a WebGL failure fails silently instead of crashing the
  page.
- **The current model has no rig and no animation clips** — it's a single
  static mesh (`sample.glb`, uploaded as a placeholder). All motion
  (rotation, sway) is done by rotating the whole mesh in code. If a
  properly rigged model (with a head/hand hierarchy or baked animation
  clips) is dropped in at the same path, `HeroFigure.tsx` can be upgraded
  to real per-part animation via drei's `useAnimations`.

---

## 🐶 Contact Section Pet

`components/ui/PetPeek.tsx` — a small illustrated pet that peeks up from
the bottom-right of the Contact section.

- Uses exactly **two** source images
  (`public/images/pet/pet-open.png` and `pet-blink.png`), converted from
  the originally uploaded JPGs with the *minimum necessary* processing
  (black background → transparent via chroma-key only — no cropping, no
  rescaling, no repositioning). Both come from the same original
  generation batch, so they're naturally pixel-aligned with each other
  with zero extra work.
- Blinks automatically every 2–5 seconds (occasional natural double-blink),
  and blinks on tap/click too.
- Does a subtle whole-image tilt toward the cursor for liveliness — this
  is a runtime CSS transform, not a swap to a different drawn frame.
- If you want true directional eye-tracking (distinct look-left/right/up
  frames), that requires *new* source art explicitly generated as
  separate poses.

---

## 📁 Actual Folder Structure

```
app/
├── about/                  — About page
├── admin/                  — Admin panel (blogs, gallery, reviews, comments) — key-gated, not NextAuth
├── api/
│   ├── chat/route.ts       — Groq streaming chat for Ask About Me
│   └── admin/gallery/      — Gallery CRUD (images + video)
├── ask-about-me/           — Dedicated AI chat page
├── automation/             — Automation & AI agent projects (incl. WazobiaVoice inference)
├── axiveri/                — Axiveri company page + trained model series
│   └── africlaude/         — Africlaude model detail page
├── benchmarks/
├── blog/[slug]/            — Individual blog post
├── blogs/                  — Blog listing
├── contact/
├── faq/
├── gallery/                — Horizontal category rails, image + video support
├── og/                     — OG image generation
├── platforms/
├── project/[slug]/         — Individual project detail page
├── reviews/
├── services/
├── work/                   — Main project grid + filters
├── layout.tsx              — Root layout (includes the hidden SVG glass filter)
└── page.tsx                — Home (Hero, Experience, Projects, Automation, etc.)

components/
├── layout/
│   ├── Navbar.tsx           — Floating glass nav pill (desktop + mobile)
│   └── Footer.tsx
├── sections/                — One file per homepage/page section
│   ├── Hero.tsx
│   ├── Experience.tsx       — Work history (Plotweaver, Renncora)
│   ├── ProjectsGrid.tsx
│   ├── Automation.tsx
│   ├── AskAboutMe.tsx
│   └── Contact.tsx          — Includes <PetPeek />
├── three/
│   ├── Hero3D.tsx            — Canvas wrapper, opacity/scroll/network logic
│   └── HeroFigure.tsx        — The actual GLTF model + rotation logic
└── ui/
    ├── GlassPanel.tsx         — CSS/WebGL glass switcher (see warning above)
    ├── ErrorBoundary.tsx      — Generic error boundary, explicit-null-fallback aware
    ├── PetPeek.tsx
    └── ProjectCard.tsx

lib/
├── prisma.ts
├── groq.ts                  — Groq client + Ask About Me system prompt
├── metadata.ts               — SEO helpers
└── utils.ts

data/
├── projects.ts               — All project entries (web, AI/ML, mobile, fintech, edtech)
├── stack.ts
└── contextChunks.ts           — AI knowledge base chunks for RAG-lite context

config/
└── site.ts                   — Site config, nav items, contact email

prisma/
└── schema.prisma             — Includes Gallery.mediaType / thumbnailUrl (video support)

public/
├── models/hero-figure.glb
└── images/
    ├── pet/                   — pet-open.png, pet-blink.png
    └── projects/
```

---

## 🚀 Quick Start

```bash
# 1. Clone and install (--legacy-peer-deps required, see .npmrc)
git clone https://github.com/Ememzyvisuals/ememzyvisuals-portfolio.git
cd ememzyvisuals-portfolio
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in DATABASE_URL, GROQ_API_KEY, RESEND_API_KEY, NEXT_PUBLIC_ADMIN_KEY

# 3. Database
npx prisma generate
npx prisma db push

# 4. Run dev
npm run dev
```

**Note:** `npm run build` already runs `prisma generate && prisma db push
--accept-data-loss && next build` — schema changes deploy automatically on
every push to Vercel, no manual migration step needed.

---

## ☁️ Deploying (Vercel, already connected)

Push to `main` — Vercel auto-deploys. Required environment variables (set
in Vercel dashboard, not in this repo):

```
DATABASE_URL
DIRECT_URL
GROQ_API_KEY
RESEND_API_KEY
CONTACT_EMAIL
NEXT_PUBLIC_ADMIN_KEY
GOOGLE_SITE_VERIFICATION
```

Cloudinary credentials (cloud name + unsigned upload preset) are entered
directly in `/admin` and stored in the browser's `localStorage` — they are
**not** environment variables.

---

## 🤖 Ask About Me (AI Chat)

`app/api/chat/route.ts` streams from Groq (`lib/groq.ts`) over SSE. No
vector DB / RAG pipeline currently — the system prompt in `lib/groq.ts`
carries Emmanuel's bio/project context directly. Requires `GROQ_API_KEY`
to be set in Vercel — without it, the route returns a clear 500 instead of
failing silently (this was a real bug that got fixed: the streaming
parser's `[DONE]` handling used to only break an inner loop, not the outer
reader loop).

The whole `<AskAboutMe />` usage is wrapped in `<ErrorBoundary>` on both
the homepage and `/ask-about-me` — a failure there degrades to a small
inline message instead of crashing the rest of the page.

---

## 📦 Managing Content

- **Projects**: edit `data/projects.ts` directly (static data, not DB-backed)
- **Trained AI/ML models** (Africlaude, WazobiaVoice, NaijaVox,
  AfriVision-Base): also live as entries in `data/projects.ts` under
  category `AI_ML`, **and** get a richer writeup on `/axiveri` — if you add
  a new trained model, update both places
- **Blogs / Reviews / Gallery**: managed via `/admin?key=YOUR_ADMIN_KEY`
- **Gallery**: supports images and video (Cloudinary), renders as
  horizontal category rails (not a top nav — that was deliberately removed)
