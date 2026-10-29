import type { Metadata } from "next";
import { games, projects } from "@/content/site";
import { SectionHead } from "@/components/ui";
import WorkIndex from "@/components/work/WorkIndex";
import { DeviceStage } from "@/components/home/ProjectShowcase";

export const metadata: Metadata = {
  title: "Work",
  description: "Web apps, mobile apps, automation tools and games built by Emmanuel Ariyo.",
};

export default function Work() {
  const lead = projects.find((p) => p.slug === "flonextv")!;
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <div className="page grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <SectionHead kicker="Work" title={<>Everything<br />I have shipped.</>} sub={`${projects.length} products and tools, plus ${games.length} games. Each one solved a real problem for real people.`} />
        <div className="-mx-4 sm:mx-0"><DeviceStage p={lead} /></div>
      </div>
      <div className="page mt-6"><WorkIndex /></div>
    </div>
  );
}
