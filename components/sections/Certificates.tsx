"use client";
// components/sections/Certificates.tsx
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { CERTIFICATES } from "@/data/extras";

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-section">
      <div className="container-padded space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="section-heading">Certificates.</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md">Courses I completed, each with what it taught me and a link to verify it.</p>
        </motion.div>
      </div>

      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-[max(2rem,calc((100vw-64rem)/2+2rem))]" tabIndex={0} aria-label="Certificates, scroll sideways">
        {CERTIFICATES.map((c, i) => (
          <motion.article
            key={c.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="card-surface flex w-[82vw] shrink-0 snap-center flex-col sm:w-[360px]"
          >
            <div className="relative aspect-[1.62] overflow-hidden border-b border-border bg-white">
              <Image src={c.image} alt={`${c.course} certificate from ${c.issuer}`} fill sizes="360px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <BadgeCheck size={14} /> {c.issuer}
              </div>
              <h3 className="font-extrabold text-foreground leading-snug">{c.course}</h3>
              <p className="flex-1 text-sm text-foreground/80 leading-relaxed">{c.taught}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => <span key={s} className="tech-badge">{s}</span>)}
              </div>
              <a href={c.verify} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 pt-1 text-sm font-bold hover:underline">
                Verify <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
