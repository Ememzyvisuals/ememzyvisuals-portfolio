import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ContactSection } from "@/components/sections/Contact";
import { Globe } from "@/components/three/earth/Globe";

export const metadata: Metadata = buildMeta({
  title: "Hire a Web Developer & AI Engineer | Contact Emmanuel Ariyo",
  description:
    "Need a high-quality website, web app, AI system, or business automation? Hire Emmanuel Ariyo (Ememzyvisuals). Available for freelance projects, full-time roles, and collaborations worldwide.",
  path: "/contact",
  ogTitle: "Let's Build Something Great",
  ogSubtitle:
    "Need a website, AI system, or automation? Emmanuel Ariyo is available.",
  ogTag: "Hire Me",
  tags: [
    "hire web developer Nigeria",
    "hire AI engineer Nigeria",
    "hire Emmanuel Ariyo",
    "freelance developer for hire",
    "get a website built",
    "business automation Nigeria",
    "web developer for hire",
  ],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="container-padded grid items-start gap-6 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-10">
        <div className="lg:sticky lg:top-24">
          <Globe className="mx-auto aspect-square w-full max-w-[560px]" />
          <p className="mt-2 text-center text-sm text-muted-foreground">Based in Nigeria. Working with teams anywhere.</p>
        </div>
        <div className="[&_#contact]:py-0 [&_.container-padded]:px-0">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
