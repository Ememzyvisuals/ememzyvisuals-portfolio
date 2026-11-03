// components/sections/Certificates.tsx
// The courses behind my work, in the order I took them.
import Image from "next/image";
import Link from "next/link";
import { CERTIFICATES } from "@/data/extras";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-section">
      <div className="container-padded">
        <SectionHeader
          title="Certificates"
          intro="The courses behind my work, in the order I took them."
          action={<Link href="/certificates" className="btn-outline">See what each one taught me</Link>}
        />

        <ol className="mt-stack grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((c, i) => (
            <li key={c.slug} className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
              <Link href={`/certificates#${c.slug}`} className="group block h-full rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-card-hover">
                <div className="relative aspect-[1200/740] overflow-hidden rounded-xl bg-secondary">
                  <Image src={c.image} alt={`${c.course} certificate from ${c.issuer}`} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className="object-contain" />
                </div>
                <div className="flex items-baseline gap-3 px-2 pb-1 pt-4">
                  <span className="text-caption font-semibold text-sun-ink tabular-nums">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-small font-semibold text-foreground group-hover:underline group-hover:underline-offset-4">{c.course}</p>
                    <p className="text-caption text-muted-foreground">{c.issuer}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
