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
  // the contact section at full width (heading and card on the left, form on the right);
  // the globe sits under the card, where the sent message flies to
  return (
    <div className="min-h-screen pt-10 md:pt-16">
      <ContactSection aside={<Globe className="mx-auto aspect-square w-full max-w-[460px]" />} />
    </div>
  );
}
