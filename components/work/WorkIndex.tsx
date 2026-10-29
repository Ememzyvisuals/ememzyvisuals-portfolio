"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { games, projects } from "@/content/site";
import { Arrow } from "@/components/ui";

type Item = { key: string; name: string; group: string; line: string; href: string; img?: string; external?: boolean };

export default function WorkIndex() {
  const items: Item[] = useMemo(
    () => [
      ...projects.map((p) => ({ key: p.slug, name: p.name, group: p.group, line: p.line, href: `/work/${p.slug}`, img: p.web ?? p.mobile?.[0] ?? p.logo })),
      ...games.map((g) => ({ key: g.slug, name: g.name, group: "Games", line: g.line, href: "/games", img: g.image })),
    ],
    [],
  );
  const groups = ["All", ...Array.from(new Set(items.map((i) => i.group)))];
  const [g, setG] = useState("All");
  const shown = g === "All" ? items : items.filter((i) => i.group === g);
  return (
    <>
      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Filter work">
        {groups.map((x) => (
          <button key={x} role="tab" aria-selected={g === x} onClick={() => setG(x)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${g === x ? "bg-fg text-bg" : "glass hover:bg-fg/5"}`}>
            {x}
          </button>
        ))}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.key}>
            <Link href={p.href} className="glass group flex h-full flex-col overflow-hidden rounded-xl3 transition hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-fg/5">
                {p.img && <Image src={p.img} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top transition duration-700 group-hover:scale-[1.04]" />}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="kicker">{p.group}</p>
                <h2 className="mt-2 text-2xl font-bold">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm text-fg/70">{p.line}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">{p.group === "Games" ? "Play" : "Case study"} <Arrow /></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
