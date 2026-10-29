import type { MetadataRoute } from "next";
import { profile, projects } from "@/content/site";
import { getPosts } from "@/lib/blog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = profile.url;
  const now = new Date();
  const pages = ["", "/work", "/models", "/games", "/about", "/certificates", "/blogs", "/contact", "/light"].map((p) => ({ url: `${u}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 }));
  const work = projects.map((p) => ({ url: `${u}/work/${p.slug}`, lastModified: now, priority: 0.6 }));
  const posts = (await getPosts()).map((p) => ({ url: `${u}/blogs/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 }));
  return [...pages, ...work, ...posts];
}
