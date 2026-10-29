"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "@/content/icons";
import { moreLinks, nav, profile, socials } from "@/content/site";
import { setStage } from "@/lib/stage";
import { useThreeOn } from "@/lib/theme";

const SocialsView = dynamic(() => import("./three/SocialsView"), { ssr: false });

export function SocialRow() {
  const three = useThreeOn();
  return (
    <div className="relative">
      {three && <SocialsView count={socials.length} />}
      <ul className="relative grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Social links">
        {socials.map((s) => (
          <li key={s.key}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              onPointerEnter={() => setStage({ focus: "social:" + s.key })}
              onPointerLeave={() => setStage({ focus: null })}
              onFocus={() => setStage({ focus: "social:" + s.key })}
              onBlur={() => setStage({ focus: null })}
              className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl ${three ? "" : "glass hover:-translate-y-1"} transition`}
            >
              <svg viewBox="0 0 24 24" className={`h-7 w-7 ${three ? "opacity-0" : ""}`} fill="currentColor" fillRule="evenodd" aria-hidden>
                <path d={icons[s.key]} />
              </svg>
              <span className="sr-only">{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line pt-16">
      <div className="page">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="kicker">Let us build something</p>
            <a href={`mailto:${profile.email}`} className="mt-3 block font-display text-[clamp(1.6rem,5vw,2.8rem)] font-extrabold tracking-tight hover:underline">
              {profile.email}
            </a>
            <p className="mt-3 max-w-md text-muted">{profile.available}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="text-fg/75 hover:text-fg">{n.label}</Link></li>
              ))}
              <li><Link href="/certificates" className="text-fg/75 hover:text-fg">Certificates</Link></li>
            </ul>
            <ul className="space-y-2">
              {moreLinks.map((l) => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-fg/75 hover:text-fg">{l.label}</a></li>
              ))}
              <li><Link href="/light" className="text-fg/75 hover:text-fg">Text-only version</Link></li>
              <li><a href="/llms.txt" className="text-fg/75 hover:text-fg">llms.txt</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12"><SocialRow /></div>
        <p className="mt-10 text-xs text-muted">
          {new Date().getFullYear()} {profile.name}. Made in Nigeria with Next.js and three.js.
        </p>
      </div>
      <div className="wordmark pointer-events-none relative mt-6 select-none" aria-hidden>
        <div className="wordmark-crisp">EMEMZYVISUALS</div>
        <div className="wordmark-blur">EMEMZYVISUALS</div>
      </div>
    </footer>
  );
}
