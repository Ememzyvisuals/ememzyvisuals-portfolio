"use client";
// components/sections/AskAboutMe.tsx
// Ask About Me: an AI assistant that knows my work. Type or speak your question (browser speech recognition),
// and any answer can be read aloud. Answers stream in from /api/chat (Groq).
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Mic, Square, Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const SUGGESTED = [
  "What does Emmanuel build at PlotWeaver?",
  "What is Axiveri?",
  "How does NaijaVox handle code-switching?",
  "What makes expressive TTS different?",
  "Which products has he shipped?",
  "Is he available for new work?",
];

type SR = { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

export function AskAboutMe() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const rec = useRef<SR | null>(null);
  const heard = useRef("");

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    setCanListen(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    setCanSpeak("speechSynthesis" in window);
    return () => { rec.current?.stop(); window.speechSynthesis?.cancel(); };
  }, []);
  useEffect(() => { if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const user: ChatMessage = { id: genId(), role: "user", content: text.trim(), timestamp: new Date() };
    const aid = genId();
    setMessages((p) => [...p, user, { id: aid, role: "assistant", content: "", timestamp: new Date() }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, user].map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Chat request failed"));
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let acc = "", done = false;
      while (reader && !done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        for (const line of dec.decode(value, { stream: true }).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") { done = true; break; }
          try { acc += JSON.parse(data).choices?.[0]?.delta?.content ?? ""; setMessages((p) => p.map((m) => (m.id === aid ? { ...m, content: acc } : m))); } catch {}
        }
      }
    } catch {
      setMessages((p) => p.map((m) => (m.id === aid ? { ...m, content: "Sorry, I could not answer that just now. Please try again in a moment." } : m)));
    } finally {
      setLoading(false);
    }
  };

  // ask with your voice: speech recognition fills the box, and the question is sent when you stop talking
  const listen = () => {
    if (listening) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const C = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!C) return;
    const r = new C();
    r.lang = navigator.language || "en-NG";
    r.interimResults = true;
    r.continuous = false;
    heard.current = "";
    r.onresult = (e) => { heard.current = Array.from(e.results).map((x) => x[0].transcript).join(" "); setInput(heard.current); };
    r.onend = () => { setListening(false); if (heard.current.trim()) send(heard.current); };
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  // read an answer aloud
  const speak = (m: ChatMessage) => {
    const s = window.speechSynthesis;
    if (speaking === m.id) { s.cancel(); setSpeaking(null); return; }
    s.cancel();
    const u = new SpeechSynthesisUtterance(m.content.replace(/[*#`_>]/g, ""));
    u.rate = 1.02;
    u.onend = () => setSpeaking(null);
    setSpeaking(m.id);
    s.speak(u);
  };

  const empty = messages.length === 0;

  return (
    <section id="ask" className="container-padded">
      <div className={cn("mx-auto flex max-w-5xl flex-col", empty && "min-h-[64vh] justify-center")}>
        {empty && (
          <div className="text-center">
            {/* my photo inside a soft, moving voice wave */}
            <div className="relative mx-auto h-28 w-28">
              <span className="absolute inset-0 rounded-full border border-foreground/20 [animation:askwave_2.6s_ease-out_infinite]" />
              <span className="absolute inset-0 rounded-full border border-foreground/20 [animation:askwave_2.6s_ease-out_1.3s_infinite]" />
              <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={112} height={112} className="relative h-28 w-28 rounded-full object-cover shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]" />
            </div>
            <h2 className="section-heading mt-8 text-foreground">
              Ask about my work
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-foreground/70">
              An assistant that knows my projects, my speech AI research and how I work. Type, or tap the mic and just ask.
            </p>
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
              {SUGGESTED.map((q) => (
                <button key={q} onClick={() => send(q)} className="rounded-full border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {!empty && (
          <div className="space-y-8 pb-6 pt-2">
            {messages.map((m) => m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-foreground px-5 py-3 text-[15px] leading-relaxed text-background">{m.content}</p>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <Image src="/images/emmanuel.jpg" alt="" width={36} height={36} className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground">Emmanuel&apos;s assistant</p>
                  {m.content ? (
                    <div className="mt-1.5 whitespace-pre-wrap text-[15.5px] leading-[1.75] text-foreground/90">{m.content}</div>
                  ) : (
                    <div className="mt-3 flex h-5 items-end gap-1" aria-label="Thinking">
                      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="block w-1 rounded-full bg-foreground/50" style={{ height: 6, animation: `askbar 0.9s ease-in-out ${i * 0.12}s infinite` }} />)}
                    </div>
                  )}
                  {m.content && canSpeak && !(loading && m === messages[messages.length - 1]) && (
                    <button onClick={() => speak(m)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      {speaking === m.id ? <><Square size={12} /> Stop</> : <><Volume2 size={13} /> Listen</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}

        {/* the ask bar */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }}
          className={cn("card-surface flex items-end gap-2 rounded-[28px] p-2 pl-5", empty ? "mt-10" : "sticky bottom-4")}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={listening ? "Listening..." : "Ask anything about my work"} aria-label="Your question"
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground" />
          {canListen && (
            <button type="button" onClick={listen} aria-label={listening ? "Stop listening" : "Ask with your voice"}
              className={cn("grid h-11 w-11 flex-shrink-0 place-items-center rounded-full transition-colors", listening ? "bg-red-500 text-white" : "text-foreground hover:bg-secondary")}>
              {listening ? <Square size={15} fill="currentColor" /> : <Mic size={18} />}
            </button>
          )}
          <button type="submit" disabled={!input.trim() || loading} aria-label="Send"
            className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30">
            <ArrowUp size={18} />
          </button>
        </form>
        {!empty && (
          <button onClick={() => { window.speechSynthesis?.cancel(); setMessages([]); }} className="mx-auto mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw size={12} /> Start a new conversation
          </button>
        )}
        <p className="mt-3 text-center text-xs text-muted-foreground">Answers are written by AI from my portfolio and can be wrong. For anything important, <a href="/contact" className="underline underline-offset-2">message me</a>.</p>
      </div>
    </section>
  );
}
