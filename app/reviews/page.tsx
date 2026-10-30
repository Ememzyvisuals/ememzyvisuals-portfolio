// app/reviews/page.tsx
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ReviewsSection } from "@/components/sections/Reviews";

export const revalidate = 30;

export const metadata: Metadata = buildMeta({
  title: "Reviews — Emmanuel Ariyo | Ememzyvisuals",
  description:
    "What clients and collaborators say about working with Emmanuel Ariyo (Ememzyvisuals). Real reviews from real people.",
  path: "/reviews",
  ogTitle: "What People Say",
  ogSubtitle: "Client reviews for Emmanuel Ariyo — Ememzyvisuals",
  ogTag: "Reviews",
});

export default function ReviewsPage() {
  return (
    <div className="min-h-screen py-16 md:py-24">
      <ReviewsSection />
    </div>
  );
}
