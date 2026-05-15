import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { AutomationSection } from "@/components/sections/Automation";

export const metadata: Metadata = buildMeta({
  title: "Business Automation & AI Agents | Emmanuel Ariyo — Ememzyvisuals",
  description:
    "Automate your business with AI. Emmanuel Ariyo builds Telegram bots, WhatsApp automation, AI agents, and workflow automation systems. Lumeo AI and Microdragon are live examples.",
  path: "/automation",
  ogTitle: "Automate Your Business with AI",
  ogSubtitle:
    "Telegram bots · WhatsApp automation · AI agents · Workflow automation",
  ogTag: "Automation",
  tags: [
    "business automation Nigeria",
    "automate my business",
    "Telegram bot for business",
    "WhatsApp bot developer",
    "AI automation developer",
    "workflow automation developer Nigeria",
    "build automation for business",
  ],
});

export default function AutomationPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-padded mb-12">
        <h1 className="section-heading">Automation.</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl">
          AI agents, autonomous bots, and workflow automation that power
          real businesses and save hours every single day.
        </p>
      </div>
      <AutomationSection />
    </div>
  );
}
