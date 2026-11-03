"use client";
// app/games/GamesPlayground.tsx
// A full-screen 3D stage for each game. Switch games at the top; drag to walk round the scene; the buttons
// make things happen the way they do in the game. Then a big Play button opens the real game.
import { useEffect, useRef, useState } from "react";
import { GAMES } from "@/data/extras";
import type { GameApi, GameScene } from "@/components/three/gameStage";

const SCENES: { slug: string; kind: GameScene; bg: string; dark: boolean; hint: string; actions: { id: string; label: string }[] }[] = [
  {
    slug: "buka-hustle", kind: "buka", dark: false,
    bg: "radial-gradient(120% 90% at 50% 20%, #fff1dc, #f6dfbd 55%, #e9c99a)",
    hint: "Drag to walk round the bùkà. Tap Mama Titi to say hello.",
    actions: [{ id: "Serve", label: "Serve a customer" }, { id: "Stir", label: "Stir the pot" }, { id: "Ladle", label: "Dish out" }, { id: "WashRice", label: "Wash rice" }, { id: "Sweep", label: "Sweep" }, { id: "Talk", label: "Chat" }],
  },
  {
    slug: "last-bus", kind: "bus", dark: true,
    bg: "radial-gradient(120% 90% at 50% 15%, #1b2440, #070912 65%, #030407)",
    hint: "Drag to circle the danfo. If you dare, get inside.",
    actions: [{ id: "inside", label: "Get inside / step out" }, { id: "flicker", label: "The bulb" }, { id: "stare", label: "Look at the passengers" }, { id: "jolt", label: "Driver, move" }],
  },
];

const ART: Record<string, string> = { "buka-hustle": "/images/games/buka-hustle.webp", "last-bus": "/stills/game-bus.webp" };

export function GamesPlayground() {
  const [i, setI] = useState(0);
  const sc = SCENES[i], game = GAMES.find((g) => g.slug === sc.slug)!;
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<GameApi | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setReady(false);
    setFailed(false);
    let stop = () => {}, alive = true;
    import("@/components/three/gameStage").then(({ mountGame }) => {
      if (!alive) return;
      stop = mountGame(el, sc.kind, () => alive && setReady(true), () => { if (alive) { setReady(false); setFailed(true); } }, { full: true, onApi: (a) => (api.current = a) });
    });
    return () => { alive = false; stop(); api.current = null; };
  }, [sc.kind]);

  const ink = sc.dark ? "text-white" : "text-[#2a160a]";
  return (
    <div className="relative min-h-[100svh] overflow-hidden transition-[background] duration-700" style={{ background: sc.bg }}>
      <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
      {failed && (
        // no 3D on this device: show the key art instead of a scene that never loads
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ART[sc.slug]} alt={`${game.name} key art`} className="absolute inset-0 h-full w-full object-cover opacity-90" />
      )}
      {!ready && !failed && <p className={`absolute inset-0 grid place-items-center text-small ${sc.dark ? "text-white/70" : "text-black/60"}`}>Loading the scene...</p>}

      {/* game switcher */}
      <nav aria-label="Choose a game" className="pointer-events-none absolute inset-x-0 top-24 flex justify-center px-4">
        <div className={`pointer-events-auto flex gap-1 rounded-full p-1 backdrop-blur ${sc.dark ? "bg-white/10" : "bg-black/5"}`}>
          {SCENES.map((s, k) => {
            const g = GAMES.find((x) => x.slug === s.slug)!;
            return (
              <button key={s.slug} onClick={() => setI(k)} aria-pressed={k === i}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${k === i ? "bg-foreground text-background" : sc.dark ? "text-white/75 hover:text-white" : "text-black/60 hover:text-black"}`}>
                {g.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* about the game, under the switcher */}
      <div className={`pointer-events-none absolute inset-x-0 top-40 px-5 text-center ${ink}`}>
        <h1 className={failed ? "sr-only" : "text-h2 drop-shadow"}>{game.name}</h1>
        {!failed && <p className="mt-2 text-small font-semibold opacity-85 drop-shadow">{game.genre}. {game.line}</p>}
      </div>

      {/* actions and play */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-6 md:pb-10">
        {!failed && <p className={`mb-3 text-center text-caption ${sc.dark ? "text-white/70" : "text-black/60"}`}>{sc.hint}</p>}
        <div className={`mx-auto max-w-3xl flex-wrap justify-center gap-2 ${failed ? "hidden" : "flex"}`}>
          {sc.actions.map((a) => (
            <button key={a.id} disabled={!ready || failed} onClick={() => api.current?.act(a.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-colors disabled:opacity-40 ${sc.dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-white/70 text-black hover:bg-white"}`}>
              {a.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <a href={game.play} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-small font-bold text-background shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] hover:opacity-90">
            Play the full game </a>
        </div>
      </div>
    </div>
  );
}
