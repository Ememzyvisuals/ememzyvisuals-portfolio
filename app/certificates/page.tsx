import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { CERTIFICATES } from "@/data/extras";
import { FramedCertificate } from "./FramedCertificate";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = buildMeta({
  title: "Certificates | Emmanuel Ariyo",
  description: "The machine learning and AI courses behind Emmanuel Ariyo's work, each with what it taught him and a link to verify it.",
  path: "/certificates",
  ogTitle: "Certificates",
  ogSubtitle: "The courses behind my work",
  ogTag: "Certificates",
  tags: ["Kaggle certificates", "machine learning courses", "AI certifications"],
});

export default function CertificatesPage() {
  return (
    <div className="pt-12 pb-section md:pt-16">
      <div className="container-padded">
        <SectionHeader as="h1" title="Certificates" intro="The courses behind my work, in the order I took them, with what each one taught me." />
        <div className="mt-stack grid gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((c, i) => (
            <article key={c.slug} id={c.slug} className="scroll-mt-28">
              <FramedCertificate image={c.image} alt={`${c.course} certificate from ${c.issuer}`} />
              <p className="mt-6 text-caption font-semibold text-sun-ink">
                Course {i + 1}, {c.issuer}
              </p>
              <h2 className="mt-2 text-h3">{c.course}</h2>
              <p className="mt-3 text-small text-foreground/80">{c.taught}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s} className="tech-badge">{s}</li>
                ))}
              </ul>
              <a href={c.verify} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">Verify certificate</a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
