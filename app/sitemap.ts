// app/sitemap.ts
// Simple, static sitemap — no imports that can fail
import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://ememzyvisuals.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // ── Core pages ─────────────────────────────────────────────
    { url: `${BASE}/`,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/services`,    lastModified: now, changeFrequency: "monthly", priority: 0.98 },
    { url: `${BASE}/work`,        lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE}/contact`,     lastModified: now, changeFrequency: "yearly",  priority: 0.95 },
    { url: `${BASE}/automation`,  lastModified: now, changeFrequency: "monthly", priority: 0.90 },
    { url: `${BASE}/benchmarks`,  lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${BASE}/platforms`,   lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blogs`,       lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/ask-about-me`,lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/reviews`,     lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${BASE}/gallery`,     lastModified: now, changeFrequency: "monthly", priority: 0.70 },

    // ── Project pages ───────────────────────────────────────────
    { url: `${BASE}/project/claudgpt`,         lastModified: now, changeFrequency: "monthly", priority: 0.92 },
    { url: `${BASE}/project/aethlife`,         lastModified: now, changeFrequency: "monthly", priority: 0.92 },
    { url: `${BASE}/project/flonextv`,         lastModified: now, changeFrequency: "monthly", priority: 0.92 },
    { url: `${BASE}/project/naijaprep`,        lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${BASE}/project/studenthub-ng`,    lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${BASE}/project/nairanest`,        lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${BASE}/project/storejet`,         lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/project/ar-toluwani-store`,lastModified: now, changeFrequency: "monthly", priority: 0.75 },
  ];
}
