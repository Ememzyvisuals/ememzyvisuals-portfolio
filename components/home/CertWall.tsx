import Image from "next/image";
import type { Certificate } from "@/content/site";
import { Ext } from "@/components/ui";

export function CertCard({ c }: { c: Certificate }) {
  return (
    <article className="glass flex h-full flex-col overflow-hidden rounded-xl3">
      <div className="relative aspect-[1.62] overflow-hidden border-b border-line bg-white">
        <Image src={c.image} alt={`${c.course} certificate from ${c.issuer}`} fill sizes="(min-width:1024px) 30vw, 85vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="kicker">{c.issuer}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug">{c.course}</h3>
        <p className="mt-3 flex-1 text-sm text-fg/75">{c.taught}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {c.skills.map((s) => <li key={s} className="tag">{s}</li>)}
        </ul>
        <Ext href={c.verify} className="mt-5 text-sm">Verify</Ext>
      </div>
    </article>
  );
}

// A horizontal wall that snaps card by card on phones.
export default function CertWall({ certificates }: { certificates: Certificate[] }) {
  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]" tabIndex={0} aria-label="Certificates, scroll sideways">
      {certificates.map((c) => (
        <div key={c.slug} className="w-[82vw] shrink-0 snap-center sm:w-[380px]">
          <CertCard c={c} />
        </div>
      ))}
    </div>
  );
}
