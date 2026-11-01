import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { CERTIFICATES } from "@/data/extras";
import { FramedCertificate } from "./FramedCertificate";

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
    <main className="pt-28 pb-section">
      <div className="container-padded">
        <h1 className="section-heading">Certificates</h1>
        <p className="font-museum mt-3 max-w-2xl text-xl text-foreground/75 md:text-2xl">
          The courses behind my work, in the order I took them. Move over a frame to tilt it.
        </p>
        <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((c, i) => (
            <article key={c.slug} id={c.slug} className="scroll-mt-28">
              <FramedCertificate image={c.image} alt={`${c.course} certificate from ${c.issuer}`} />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")} / {c.issuer}
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{c.course}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{c.taught}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80">{s}</li>
                ))}
              </ul>
              <a href={c.verify} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 inline-flex text-sm">Verify certificate</a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
