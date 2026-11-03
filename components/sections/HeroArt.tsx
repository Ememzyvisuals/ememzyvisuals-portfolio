// components/sections/HeroArt.tsx
// The illustration slot beside the hero text.
// With an image (public/illustrations/hero.webp, .png, .jpg or .svg) it shows that illustration in a frame.
// Without one it shows a finished geometric composition: tiles drawn after adire, the Yoruba indigo
// resist-dyed cloth, with a voice wave running through them, for the speech AI work.
// Motion is one entrance on load (CSS only), and it is switched off for reduced motion.
import Image from "next/image";

type Tone = "indigo" | "sun" | "paper" | "ink";
type Motif = "rings" | "moon" | "stripes" | "dots" | "petal" | "cross" | "quarter" | "wave";

// 4 columns x 5 rows, read left to right
const TILES: [Motif, Tone][] = [
  ["rings", "indigo"], ["quarter", "paper"], ["stripes", "indigo"], ["moon", "sun"],
  ["dots", "paper"], ["petal", "indigo"], ["cross", "paper"], ["rings", "indigo"],
  ["wave", "ink"], ["wave", "ink"], ["wave", "ink"], ["wave", "ink"],
  ["moon", "indigo"], ["stripes", "paper"], ["quarter", "sun"], ["dots", "indigo"],
  ["cross", "indigo"], ["rings", "paper"], ["petal", "indigo"], ["stripes", "paper"],
];

const FILL: Record<Tone, { bg: string; fg: string }> = {
  indigo: { bg: "hsl(var(--art-indigo))", fg: "hsl(var(--art-paper))" },
  sun: { bg: "hsl(var(--sun))", fg: "hsl(var(--art-paper))" },
  paper: { bg: "hsl(var(--art-paper))", fg: "hsl(var(--art-indigo))" },
  ink: { bg: "hsl(var(--art-ink))", fg: "hsl(var(--sun))" },
};

// one slice of the voice wave per tile, so the four tiles in the middle row join into one wave
const WAVE = [6, 14, 26, 18, 34, 22, 12, 30, 40, 24, 16, 36, 28, 10, 20, 32, 38, 18, 26, 8];

function MotifSvg({ motif, fg, col }: { motif: Motif; fg: string; col: number }) {
  const s = { stroke: fg, fill: "none", strokeWidth: 3 } as const;
  switch (motif) {
    case "rings":
      return <g {...s}><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="22" /><circle cx="50" cy="50" r="10" fill={fg} /></g>;
    case "moon":
      return <g><circle cx="50" cy="50" r="32" fill={fg} /><circle cx="62" cy="42" r="26" fill="currentColor" /></g>;
    case "stripes":
      return <g {...s}>{[18, 34, 50, 66, 82].map((y) => <path key={y} d={`M10 ${y} Q30 ${y - 7} 50 ${y} T90 ${y}`} />)}</g>;
    case "dots":
      return <g fill={fg}>{[22, 50, 78].flatMap((x) => [22, 50, 78].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={x === 50 && y === 50 ? 9 : 5.5} />))}</g>;
    case "petal":
      return <g fill={fg}>{[0, 90, 180, 270].map((r) => <ellipse key={r} cx="50" cy="28" rx="10" ry="20" transform={`rotate(${r} 50 50)`} />)}<circle cx="50" cy="50" r="6" fill="currentColor" /></g>;
    case "cross":
      return <g {...s} strokeWidth={4}><path d="M50 14 V86 M14 50 H86" /><rect x="34" y="34" width="32" height="32" transform="rotate(45 50 50)" /></g>;
    case "quarter":
      return <g fill={fg}><path d="M0 0 H56 A56 56 0 0 1 0 56 Z" /><path d="M100 100 H44 A56 56 0 0 1 100 44 Z" opacity="0.55" /></g>;
    case "wave": {
      const bars = WAVE.slice(col * 5, col * 5 + 5);
      return <g fill={fg}>{bars.map((h, i) => <rect key={i} x={8 + i * 19} y={50 - h} width="8" height={h * 2} rx="4" />)}</g>;
    }
  }
}

export function HeroArt({ src }: { src?: string | null }) {
  if (src) {
    return (
      <figure className="hero-art relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-lift">
        <Image src={src} alt="Illustration of Emmanuel Ariyo" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </figure>
    );
  }

  return (
    <figure className="hero-art relative w-full" aria-label="Adire pattern tiles with a voice wave running through them">
      <div className="grid grid-cols-4 gap-2 rounded-[28px] border border-border bg-card p-2 shadow-lift sm:gap-2.5 sm:p-2.5">
        {TILES.map(([motif, tone], i) => {
          const f = FILL[tone];
          return (
            <div
              key={i}
              className={`hero-tile aspect-square overflow-hidden ${motif === "wave" ? "rounded-md" : "rounded-xl"}`}
              style={{ background: f.bg, color: f.bg, animationDelay: `${80 + i * 28}ms` }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                <MotifSvg motif={motif} fg={f.fg} col={i % 4} />
              </svg>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
