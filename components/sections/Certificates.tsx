"use client";
// components/sections/Certificates.tsx
// The certificates hang on a gallery wall, joined by red thread in the order I took the courses.
import { motion } from "framer-motion";
import { CERTIFICATES } from "@/data/extras";
import { CertificateWall } from "@/components/three/certs/CertificateWall";

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-section">
      <div className="container-padded space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="section-heading">Certificates</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md">The courses behind my work, in the order I took them.</p>
        </motion.div>

        <CertificateWall />

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {CERTIFICATES.map((c) => (
            <li key={c.slug}>
              <a href={c.verify} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                {c.course} </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
