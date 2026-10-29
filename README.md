# Ememzyvisuals portfolio (v2)

Emmanuel Ariyo's portfolio. Next.js 14, React Three Fiber, one WebGL canvas for the whole site.

## How it is built

- **One canvas.** Every 3D moment is a drei `View` that draws into its own box on the page. No second WebGL context, ever.
- **Three quality levels.** `full`, `lite` and `off`, chosen from reduced motion, Data Saver, network speed and WebGL support, then adjusted from real frame times. Visitors can switch in the nav. `?q=off|lite|full` forces one.
- **Real loader.** The glass EMEMZYVISUALS letters drop in as assets load and shaders compile (`compileAsync`). No fake percentage.
- **Content first.** Every section is real HTML that works with 3D off. The 3D is drawn on top.
- **For agents.** `/llms.txt`, `/llms-full.txt`, `/light`, JSON-LD, sitemap. Requests to `/` with `Accept: text/markdown` get Markdown.

## Content

- Site copy: `content/site.ts`
- Blog posts: `content/blog/*.md` (front matter + Markdown). Posts written in `/admin` live in Turso and override a file with the same slug.
- House rule: no em dashes in any copy. `npm run check:copy` fails if one sneaks in.

## Setup

Copy `.env.example` to `.env.local`. Everything is optional; see the comments in that file.

```bash
npm install
npm run dev
```

## Scripts

- `node scripts/make-typeface.mjs` rebuilds the 3D letter font from Bricolage Grotesque 800.
- `node scripts/make-icons.mjs` rebuilds the social icon paths (simple-icons, CC0).
