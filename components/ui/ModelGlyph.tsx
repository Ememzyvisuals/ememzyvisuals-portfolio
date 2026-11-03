// components/ui/ModelGlyph.tsx
// Flat illustration for each Axiveri model family, drawn in the site palette (no WebGL).
//   asr:   a voice wave turning into letters      tts:   letters turning into a voice wave
//   llm:   words joined into a sentence graph     image: noisy tiles settling into a sunset
import type { ModelKind } from "@/data/models";
import { cn } from "@/lib/utils";

const BARS = [10, 22, 36, 52, 70, 58, 80, 64, 44, 72, 50, 30, 18];
const LETTERS = ["ẹ", "ọ", "ṣ", "ń", "à"];

export function ModelGlyph({ kind, label, className, onBrand = false }: { kind: ModelKind; label: string; className?: string; onBrand?: boolean }) {
  const ink = onBrand ? "hsl(0 0% 100%)" : "hsl(var(--brand))";
  const sun = onBrand ? "hsl(40 100% 85%)" : "hsl(var(--sun))";
  const faint = onBrand ? "hsl(0 0% 100% / 0.35)" : "hsl(var(--foreground) / 0.14)";
  return (
    <div className={cn("relative overflow-hidden", className)} role="img" aria-label={label}>
      <svg viewBox="0 0 500 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {kind === "asr" && (
          <g>
            {BARS.map((h, i) => (
              <rect key={i} x={40 + i * 17} y={150 - h} width="9" height={h * 2} rx="4.5" fill={i > 9 ? faint : ink} />
            ))}
            <path d="M268 150 H300" stroke={sun} strokeWidth="4" strokeLinecap="round" />
            {LETTERS.map((l, i) => (
              <text key={l} x={318 + (i % 3) * 52} y={i < 3 ? 138 : 200} fontSize="52" fontWeight="800" fontFamily="var(--font-display)" fill={i === 1 ? sun : ink}>{l}</text>
            ))}
          </g>
        )}
        {kind === "tts" && (
          <g>
            {LETTERS.map((l, i) => (
              <text key={l} x={40 + (i % 3) * 52} y={i < 3 ? 138 : 200} fontSize="52" fontWeight="800" fontFamily="var(--font-display)" fill={i === 3 ? sun : ink}>{l}</text>
            ))}
            <path d="M210 150 H242" stroke={sun} strokeWidth="4" strokeLinecap="round" />
            {BARS.map((h, i) => (
              <rect key={i} x={258 + i * 17} y={150 - h} width="9" height={h * 2} rx="4.5" fill={i < 3 ? faint : ink} />
            ))}
          </g>
        )}
        {kind === "llm" && (
          <g>
            {[[90, 90, 210, 70], [210, 70, 330, 110], [330, 110, 420, 200], [90, 90, 150, 210], [150, 210, 290, 220], [290, 220, 420, 200], [210, 70, 290, 220]].map(([a, b, c, d], i) => (
              <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={i === 6 ? sun : faint} strokeWidth={i === 6 ? 4 : 3} />
            ))}
            {[["Ẹ kú", 90, 90], ["àárọ̀", 210, 70], ["how", 330, 110], ["you", 420, 200], ["dey", 150, 210], ["today", 290, 220]].map(([w, x, y], i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r="30" fill={i === 1 ? sun : ink} />
                <text x={x as number} y={(y as number) + 6} textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="var(--font-body)" fill={onBrand ? "hsl(var(--brand))" : "hsl(var(--brand-foreground))"}>{w}</text>
              </g>
            ))}
          </g>
        )}
        {kind === "image" && (
          <g>
            {Array.from({ length: 8 * 5 }).map((_, i) => {
              const c = i % 8, r = Math.floor(i / 8);
              const settled = c >= 2;
              const fill = r < 2 ? sun : r < 3 ? "hsl(var(--sun) / 0.55)" : ink;
              return <rect key={i} x={70 + c * 46} y={40 + r * 46} width="40" height="40" rx="8" fill={settled ? fill : faint} opacity={settled ? 1 : 0.6 + ((i * 7) % 4) / 10} />;
            })}
            <circle cx="300" cy="110" r="34" fill="hsl(var(--art-paper))" opacity="0.9" />
          </g>
        )}
      </svg>
    </div>
  );
}
