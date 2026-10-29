import type { Metadata } from "next";
import { certificates } from "@/content/site";
import { SectionHead } from "@/components/ui";
import { CertCard } from "@/components/home/CertWall";
import CertHero from "@/components/work/CertHero";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Course certificates from Kaggle and IBM SkillsBuild, each with the skills it taught and a public verification link.",
};

export default function Certificates() {
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <div className="page">
        <SectionHead kicker="Certificates" title={<>Courses I<br />completed.</>} sub="Machine learning, deep learning, computer vision and AI foundations. Every certificate links to its public verification page." />
      </div>
      <CertHero />
      <div className="page mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => <CertCard key={c.slug} c={c} />)}
      </div>
    </div>
  );
}
