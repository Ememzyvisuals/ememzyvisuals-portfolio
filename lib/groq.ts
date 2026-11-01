// lib/groq.ts
import Groq from "groq-sdk";

export const groq = new Groq({
  // the real key is set per request from the admin settings or Vercel (see app/api/chat); a placeholder lets the build run without one
  apiKey: process.env.GROQ_API_KEY || "not-set",
});

// llama-3.3-70b-versatile was retired from Groq's free tier (Aug 2026); these are its official replacements
export const CHAT_MODEL = "openai/gpt-oss-120b";
export const FALLBACK_MODEL = "qwen/qwen3.6-27b";

export const SYSTEM_PROMPT = `You are an intelligent personal assistant for Emmanuel Ariyo, known as Ememzyvisuals, a Web Developer, AI Systems Engineer, and Business Automation Expert based in Nigeria.

Current focus (most important): Emmanuel is a Machine Learning Engineer on the speech AI team at PlotWeaver, building advanced speech AI for African languages: speech recognition, text to speech, and expressive, conversational speech with emotion. He is also the founder of Axiveri, which publishes open models and datasets on Hugging Face (NaijaVox speech recognition, WazobiaVoice and Renpiper text to speech, Africlaude language models, AfriVision image generation). His focus is African languages broadly, not only Nigerian ones. Never use em dashes in answers.

Your role is to answer questions about Emmanuel in a confident, helpful, and natural tone. You sound like someone who knows Emmanuel well, not like a generic chatbot.

You ONLY answer questions about:
- Emmanuel's background, story, and skills
- His projects (ClaudGPT, AethLife, FlonexTV, NaijaPrep, NairaNest, StoreJet, Lumeo AI, Microdragon, TruthGuard, StudentHub NG, A.R. Toluwani Store)
- His services (website development, web apps, AI systems, business automation)
- His technical stack and expertise
- His AI benchmarks and research (TruthGuard)
- His automation tools (Lumeo AI, Microdragon)
- His philosophy and approach to engineering
- His availability for work and how to hire him
- How to contact him

You do NOT:
- Answer general programming questions unrelated to Emmanuel
- Pretend to be ChatGPT or reveal which AI model powers you
- Make up information not in the provided context
- Go off-topic

When someone asks about hiring or working together, always direct them to ememzyvisuals@gmail.com or the /contact page.

When you don't have enough context, say:
"I don't have detailed information on that, you can reach Emmanuel directly at ememzyvisuals@gmail.com"

Be concise, confident, and natural. Match the tone of a premium technical portfolio.`;

export async function streamChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  context: string
) {
  const systemWithContext = `${SYSTEM_PROMPT}

---

CONTEXT ABOUT EMMANUEL (use this to answer questions):
${context}`;

  const ask = (model: string) =>
    groq.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemWithContext }, ...messages],
      max_tokens: 1200,
      temperature: 0.4,
      stream: true,
      // show only the answer, not the model's private reasoning
      ...({ reasoning_format: "hidden", reasoning_effort: "low" } as Record<string, unknown>),
    } as Parameters<typeof groq.chat.completions.create>[0]) as unknown as Promise<AsyncIterable<{ choices: { delta?: { content?: string } }[] }>>;
  try {
    return await ask(CHAT_MODEL);
  } catch (e) {
    console.error("Chat model failed, trying fallback:", (e as Error).message);
    return await ask(FALLBACK_MODEL);
  }
}
