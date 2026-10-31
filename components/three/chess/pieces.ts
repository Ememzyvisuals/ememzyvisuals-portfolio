// components/three/chess/pieces.ts
// Which tool each chess piece stands for. White is the AI and product side I lead with, black is the rest of the stack.
export type Kind = "k" | "q" | "r" | "b" | "n" | "p";
export type Tech = { name: string; use: string; seen: string };

const t = (name: string, use: string, seen: string): Tech => ({ name, use, seen });

// Back rank from file a to h, then the pawns a to h.
export const WHITE: { back: Tech[]; pawns: Tech[] } = {
  back: [
    t("Next.js", "Every web product I ship, from landing pages to full apps.", "Jagora, FlonexTV, this site"),
    t("Flutter", "Cross-platform mobile apps with offline support.", "Ekklesia"),
    t("Hugging Face", "Hosting, sharing and versioning the open models I publish.", "Axiveri models"),
    t("PyTorch", "Training and fine-tuning speech, language and vision models.", "NaijaVox 2.0, Africlaude-7B"),
    t("Python", "The language behind all my ML work, data pipelines and tooling.", "NaijaTTS, AfriVision"),
    t("Whisper", "Speech recognition for Nigerian languages, fine-tuned with LoRA.", "NaijaVox 2.0"),
    t("Rust", "Fast, safe command line tools.", "MICRODRAGON"),
    t("TypeScript", "Typed front ends and back ends that stay easy to change.", "Convertly, Jagora"),
  ],
  pawns: [
    t("Supabase", "Auth, Postgres and storage for quick product back ends.", "FlonexTV"),
    t("Turso", "Light SQLite at the edge for stats and settings.", "This blog"),
    t("Tailwind", "Styling every interface quickly and consistently.", "This site"),
    t("three.js", "Real-time 3D for the web: games, product scenes, this board.", "LAST BUS, Bùkà Hustle"),
    t("React", "Component UIs across web projects.", "Jagora"),
    t("Node.js", "APIs, scripts and server code.", "STORM APIs"),
    t("Docker", "Packaging models and APIs so they run the same anywhere.", "STORM servers"),
    t("Git", "Version control for everything I build.", "Every repo"),
  ],
};

export const BLACK: { back: Tech[]; pawns: Tech[] } = {
  back: [
    t("PostgreSQL", "Relational data for apps that need to grow.", "FlonexTV"),
    t("Playwright", "Browser automation and visual checks.", "Automation work"),
    t("Gradio", "Quick demos so people can try a model in the browser.", "Hugging Face Spaces"),
    t("CUDA", "GPU training runs on cloud machines.", "ASR and TTS training"),
    t("Transformers", "The library I fine-tune most models with.", "Africlaude-7B"),
    t("Jupyter", "Experiments, evaluation and data exploration.", "AfriclaudeBench"),
    t("Pandas", "Cleaning and shaping audio and text datasets.", "Dataset pipelines"),
    t("Express", "Small, focused REST APIs.", "Client back ends"),
  ],
  pawns: [
    t("HTML5", "Semantic, accessible markup.", "Every site"),
    t("CSS3", "Layout and motion without heavy libraries.", "Every site"),
    t("JavaScript", "Browser games and interactive pages.", "Lagos Hustle"),
    t("NumPy", "Fast numeric work on audio and features.", "TTS data prep"),
    t("Prisma", "Typed database access in Node apps.", "Client apps"),
    t("Firebase", "Realtime data and auth for small apps.", "Early projects"),
    t("Vercel", "Deploying web apps with previews on every push.", "This site"),
    t("Groq", "Very fast LLM inference inside products.", "ClaudGPT"),
  ],
};

export const ORDER: Kind[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
export const KIND_NAME: Record<Kind, string> = { k: "King", q: "Queen", r: "Rook", b: "Bishop", n: "Knight", p: "Pawn" };
