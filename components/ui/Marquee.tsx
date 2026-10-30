"use client";
// components/ui/Marquee.tsx — scrolling ticker strip

const ITEMS = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Groq API",
  "LLaMA", "Prisma", "PostgreSQL", "Framer Motion", "Vercel",
  "Python", "Telegram Bot API", "Multi-Agent AI", "RAG Pipelines",
  "Africlaude-7B", "Axiveri", "TruthGuard", "ClaudGPT",
  "Full-Stack Development", "AI Systems", "Business Automation",
  "Open Source AI", "African Language Models",
];

export function Marquee() {
  const repeated = [...ITEMS, ...ITEMS]; // double for seamless loop

  return (
    <div className="overflow-hidden border-y border-border py-4 bg-secondary/30">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          animation: "marquee 40s linear infinite",
          width: "max-content",
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 inline-block flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
