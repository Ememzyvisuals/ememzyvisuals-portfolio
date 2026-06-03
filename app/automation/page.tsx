// app/automation/page.tsx
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { AutomationSection } from "@/components/sections/Automation";

export const metadata: Metadata = buildMeta({
  title: "Automation & AI Agents | Emmanuel Ariyo — Ememzyvisuals",
  description: "Automate your business with AI. Emmanuel Ariyo builds Telegram bots, WhatsApp automation, AI agents, and workflow automation systems.",
  path: "/automation",
  ogTitle: "Automation & AI Agents",
  ogSubtitle: "Telegram bots · WhatsApp automation · AI agents · Workflow automation",
  ogTag: "Automation",
});

// No extra header here — AutomationSection already has the "Automation." heading
export default function AutomationPage() {
  return (
    <div className="py-16 md:py-24">
      <AutomationSection />
    </div>
  );
}
