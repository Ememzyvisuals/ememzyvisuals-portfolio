import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ContactSection } from "@/components/sections/Contact";

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
    <div className="min-h-screen py-16 md:py-24">
      <ContactSection />
    </div>
  );
}
