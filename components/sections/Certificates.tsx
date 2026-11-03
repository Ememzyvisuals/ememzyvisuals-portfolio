// components/sections/Certificates.tsx
// The same framed certificates as the certificates page (each tilts toward the pointer), the first three here.
import Link from "next/link";
import { CERTIFICATES } from "@/data/extras";
import { FramedCertificate } from "@/app/certificates/FramedCertificate";

export function CertificatesSection() {
  const shown = CERTIFICATES.slice(0, 3);
  return (
    <section id="certificates" className="py-section">
      <div className="container-padded">
        <h2 className="section-heading">Certificates</h2>
        <p className="font-museum mt-3 max-w-2xl text-xl text-foreground/75 md:text-2xl">
          The courses behind my work, in the order I took them. Move over a frame to tilt it.
        </p>
        <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((c, i) => (
            <article key={c.slug}>
              <FramedCertificate image={c.image} alt={`${c.course} certificate from ${c.issuer}`} />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")} / {c.issuer}
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{c.course}</h3>
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
        <div className="mt-16 flex justify-center">
          <Link href="/certificates" className="btn-outline text-sm">See all {CERTIFICATES.length} certificates</Link>
        </div>
      </div>
    </section>
  );
}
