// app/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Stack } from "@/components/sections/Stack";
import { AutomationSection } from "@/components/sections/Automation";
import { BenchmarkSection } from "@/components/sections/Benchmarks";
import { AskAboutMe } from "@/components/sections/AskAboutMe";
import { ReviewsSection } from "@/components/sections/Reviews";
import { ContactSection } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/og?title=Emmanuel+Ariyo&subtitle=Web+Developer+%7C+AI+Engineer+%7C+Business+Automation&tag=Hire+Me`,
        width: 1200,
        height: 630,
        alt: "Emmanuel Ariyo — Ememzyvisuals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      `${siteConfig.url}/og?title=Emmanuel+Ariyo&subtitle=Web+Developer+%7C+AI+Engineer+%7C+Business+Automation`,
    ],
  },
};

const div = (
  <div className="container-padded">
    <div className="section-divider" />
  </div>
);

export default function HomePage() {
  return (
    <>
      <Hero />
      {div}
      <ProjectsGrid />
      {div}
      <AutomationSection />
      {div}
      <BenchmarkSection />
      {div}
      <Stack />
      {div}
      <AskAboutMe />
      {div}
      <ReviewsSection />
      {div}
      <ContactSection />
    </>
  );
}
