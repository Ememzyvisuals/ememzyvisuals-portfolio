import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { AskAboutMe } from "@/components/sections/AskAboutMe";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = buildMeta({
  title: "Ask About Emmanuel Ariyo | Ememzyvisuals",
  description: "Ask anything about Emmanuel Ariyo (Ememzyvisuals), his projects, skills, AI research, and how to work together. Powered by an AI assistant trained on his work.",
  path: "/ask-about-me",
  ogTitle: "Ask About Emmanuel",
  ogSubtitle: "AI assistant trained on Emmanuel's projects, skills & experience",
  ogTag: "AI Chat",
});

export default function AskPage() {
  return (
    <div className="min-h-screen pb-16 pt-6 md:pb-24 md:pt-10">
      <ErrorBoundary>
        <AskAboutMe />
      </ErrorBoundary>
    </div>
  );
}
