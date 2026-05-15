// app/gallery/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "./GalleryGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description: `Behind the scenes, events, and creative work by ${siteConfig.fullName}`,
  openGraph: { title: `Gallery | ${siteConfig.name}`, url: `${siteConfig.url}/gallery` },
  alternates: { canonical: `${siteConfig.url}/gallery` },
};

async function getGallery() {
  try {
    return await prisma.gallery.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch { return []; }
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
