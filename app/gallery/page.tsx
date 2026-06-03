// app/gallery/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "./GalleryGrid";
import { buildMeta } from "@/lib/metadata";

export const revalidate = 30; // Refresh every 30 seconds so new images appear fast

export const metadata: Metadata = buildMeta({
  title: "Gallery — Emmanuel Ariyo | Ememzyvisuals",
  description: `Behind the scenes, events, and creative visuals by ${siteConfig.fullName}`,
  path: "/gallery",
  ogTitle: "Gallery",
  ogSubtitle: "Behind the scenes, events, and creative work",
  ogTag: "Gallery",
});

async function getGallery() {
  try {
    return await prisma.gallery.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="py-16 md:py-24">
      <div className="container-padded space-y-12">
        <div className="max-w-2xl">
          <h1 className="section-heading">Gallery.</h1>
          <p className="text-lg text-muted-foreground mt-4">
            Behind the scenes, events, and creative visuals.
          </p>
        </div>
        <GalleryGrid items={items} />
      </div>
    </div>
  );
}
