// app/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { AutomationSection } from "@/components/sections/Automation";
import { BenchmarkSection } from "@/components/sections/Benchmarks";
import { Stack } from "@/components/sections/Stack";
import { AskAboutMe } from "@/components/sections/AskAboutMe";
import { ReviewsSection } from "@/components/sections/Reviews";
import { ContactSection } from "@/components/sections/Contact";

const OG_IMAGE = `https://ememzyvisuals.vercel.app/og/og-image.png`;

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: { canonical: "https://ememzyvisuals.vercel.app" },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "https://ememzyvisuals.vercel.app",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Emmanuel Ariyo — Ememzyvisuals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
};

const divider = (
  <div className="container-padded">
    <div className="section-divider" />
  </div>
);

export default function HomePage() {
  return (
    <>
      <Hero />
      {divider}
      <ProjectsGrid />
      {divider}
      <AutomationSection />
      {divider}
      <BenchmarkSection />
      {divider}
      <Stack />
      {divider}
      <AskAboutMe />
      {divider}
      <ReviewsSection />
      {divider}
      <ContactSection />
    </>
  );
}
