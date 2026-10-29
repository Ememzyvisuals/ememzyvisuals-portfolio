"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/site";
import { useThreeOn } from "@/lib/theme";
import { Arrow, Ext, Tags } from "@/components/ui";

const DeviceView = dynamic(() => import("@/components/three/DeviceView"), { ssr: false });

const toTex = (src?: string) => (src ? "/tex/" + src.split("/").pop()!.replace(".png", ".webp") : undefined);
export function texFor(p: Project) {
  return { web: toTex(p.web), mobile: toTex(p.mobile?.[0]) };
}

export function DeviceStage({ p }: { p: Project }) {
  const three = useThreeOn();
  const tex = texFor(p);
  if (!tex.web && !tex.mobile)
    return (
      <div className="relative grid h-64 place-items-center sm:h-80">
        {p.logo && <Image src={p.logo} alt={`${p.name} logo`} width={480} height={320} className="h-40 w-auto object-contain sm:h-52" />}
      </div>
    );
  return (
    <div className="relative h-64 sm:h-80">
      {three ? (
        <DeviceView web={tex.web} mobile={tex.mobile} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-4 p-6">
          {p.web && <Image src={p.web} alt={`${p.name} on desktop`} width={1366} height={766} className="max-h-full w-auto rounded-lg border border-line object-contain shadow-xl" />}
          {!p.web && p.mobile?.[0] && <Image src={p.mobile[0]} alt={`${p.name} on mobile`} width={360} height={780} className="max-h-full w-auto rounded-2xl border border-line object-contain shadow-xl" />}
        </div>
      )}
    </div>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {projects.map((p) => (
        <article key={p.slug} className="glass flex flex-col overflow-hidden rounded-xl3">
          <DeviceStage p={p} />
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <p className="kicker">{p.group}</p>
            <h3 className="mt-2 text-3xl font-bold">{p.name}</h3>
            <p className="mt-3 flex-1 text-fg/75">{p.line}</p>
            <Tags items={p.stack.slice(0, 5)} className="mt-5" />
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={`/work/${p.slug}`} className="btn-solid">Case study <Arrow /></Link>
              {p.live && <Ext href={p.live} className="text-sm">Live</Ext>}
              {p.repo && <Ext href={p.repo} className="text-sm">Code</Ext>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
