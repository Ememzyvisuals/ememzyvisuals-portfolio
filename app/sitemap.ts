// app/sitemap.ts
import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ALL_PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.98 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.95 },
    { url: `${base}/automation`, lastModified: now, changeFrequency: "monthly", priority: 0.90 },
    { url: `${base}/benchmarks`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${base}/platforms`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/ask-about-me`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.70 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = ALL_PROJECTS.map((p) => ({
    url: `${base}/project/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.90 : 0.75,
  }));

  return [...staticRoutes, ...projectRoutes];
}
