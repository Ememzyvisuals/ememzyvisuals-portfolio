// app/gallery/page.tsx
// Photos and videos of me and my work, uploaded from the admin page (Cloudinary files, list in Turso).
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMeta } from "@/lib/metadata";
import { tursoReady } from "@/lib/turso";
import { listGallery, type GalleryItem } from "@/lib/store";
import { GalleryView } from "./GalleryView";

export const revalidate = 60;

export const metadata: Metadata = buildMeta({
  title: "Gallery, Emmanuel Ariyo | Ememzyvisuals",
  description: `Photos and videos of ${siteConfig.fullName} at work, building speech AI for African languages and shipping products.`,
  path: "/gallery",
  ogTitle: "Gallery",
  ogSubtitle: "Photos and videos from the work",
  ogTag: "Gallery",
});

async function items(): Promise<GalleryItem[]> {
  if (!tursoReady) return [];
  try { return await listGallery(); } catch { return []; }
}

export default async function GalleryPage() {
  const list = await items();
  return (
    <div className="pb-24 pt-10 md:pt-16">
      <header className="container-padded mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-muted-foreground">Gallery</p>
        <h1 className="mt-3 font-display font-extrabold leading-[1.02] tracking-tight text-foreground" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}>
          Behind the work.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-foreground/70">
          Photos and videos from the desk, the recording sessions and the places this work takes me.
        </p>
      </header>
      <GalleryView items={list} />
    </div>
  );
}
