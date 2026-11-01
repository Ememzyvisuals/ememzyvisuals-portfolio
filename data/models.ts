// Axiveri open model series, shared by the Axiveri page and the home page.
import type { ModelKind } from "@/components/three/models/modelStage";

export type Series = { slug: string; name: string; type: string; kind: ModelKind; visual: string; desc: string; tags: string[]; stat: string; links: { label: string; href: string }[] };
export const MODEL_SERIES: Series[] = [
  {
    slug: "naijavox", name: "NaijaVox", type: "Speech recognition", kind: "asr",
    visual: "A voice wave flowing in and breaking into African language letters",
    desc: "Speech recognition that understands Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian accented English, including people switching between them mid-sentence. Version 2.0 is Whisper fine-tuned with LoRA and trained with noise so it holds up in real rooms.",
    tags: ["Whisper LoRA", "Code-switching", "Noise robust", "5 languages"],
    stat: "NaijaVox 2.0: 691 downloads this month, plus a live demo",
    links: [{ label: "NaijaVox 2.0", href: "https://huggingface.co/Axiveri/NaijaVox-2.0" }, { label: "Try the demo", href: "https://huggingface.co/spaces/Axiveri/Naijavox-Demo" }],
  },
  {
    slug: "wazobiavoice", name: "WazobiaVoice", type: "Text to speech and voice cloning", kind: "tts",
    visual: "African language letters flowing in and becoming a lively voice wave",
    desc: "Multilingual text to speech and zero-shot voice cloning in one model, extended to handle writing it was never designed for, like Yoruba tone marks. Alongside it, Renpiper is a small, fast Nigerian Pidgin voice with an ONNX build for modest hardware.",
    tags: ["Voice cloning", "Tone marks", "Pidgin", "ONNX"],
    stat: "Pidgin speech dataset: 1,438 downloads this month",
    links: [{ label: "WazobiaVoice", href: "https://huggingface.co/Axiveri/WazobiaVoice" }, { label: "Renpiper Pidgin", href: "https://huggingface.co/Axiveri/Renpiper-pcm-V1" }],
  },
  {
    slug: "africlaude", name: "Africlaude", type: "Language models", kind: "llm",
    visual: "A web of connected words lighting up as a sentence forms",
    desc: "Open language models tuned for African context, with AfriclaudeBench to measure how well any model actually understands it.",
    tags: ["7B parameters", "Open weights", "AfriclaudeBench"],
    stat: "Africlaude-7B: 24 downloads this month",
    links: [{ label: "Africlaude-7B", href: "https://huggingface.co/Axiveri/Africlaude-7B" }, { label: "Learn more", href: "/axiveri/africlaude" }],
  },
  {
    slug: "afrivision", name: "AfriVision", type: "Image generation", kind: "image",
    visual: "Noisy orange tiles settling into a picture of a sunset and a baobab",
    desc: "A FLUX LoRA trained on AfriVision-30K, captioned images of African people, places and culture, so generated images look like the continent as it really is.",
    tags: ["FLUX LoRA", "AfriVision-30K", "Open dataset"],
    stat: "AfriVision-30K: 81 downloads this month",
    links: [{ label: "AfriVision-Base", href: "https://huggingface.co/Axiveri/AfriVision-Base" }, { label: "The dataset", href: "https://huggingface.co/datasets/Axiveri/AfriVision-30K" }],
  },
];
