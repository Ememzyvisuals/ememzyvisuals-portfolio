"use client";
// components/sections/AskAboutMe.tsx

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUESTIONS = [
  "What are Emmanuel's featured projects?",
  "Tell me about TruthGuard benchmark",
  "What AI tools has he built?",
  "What's his tech stack?",
  "Is he available for hire?",
  "What is Microdragon?",
];

export function AskAboutMe() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Add streaming assistant message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accum = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content ?? "";
                accum += content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accum } : m
                  )
                );
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Sorry, I couldn't process that. Please try again.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const reset = () => setMessages([]);

  return (
    <section id="ask" className="py-section">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 pill mb-2">
              <Sparkles size={13} />
              <span className="text-xs">AI-Powered</span>
            </div>
            <h2 className="section-heading">Ask About Me.</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Ask anything about Emmanuel — projects, skills, philosophy, or how to work together.
            </p>
          </motion.div>

          {/* Chat container */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="card-surface overflow-hidden"
          >
            {/* Messages area */}
            <div className="h-[420px] overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
                    <Bot size={22} className="text-background" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ask me anything</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      I know everything about Emmanuel&apos;s work and experience.
                    </p>
                  </div>

                  {/* Suggested questions */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                            <Bot size={13} className="text-background" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] text-sm leading-relaxed",
                            msg.role === "user"
                              ? "chat-bubble-user"
                              : "chat-bubble-assistant",
                            msg.role === "assistant" && !msg.content && "typing-cursor"
                          )}
                        >
                          {msg.content || (isLoading ? " " : "")}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Divider */}
            <div className="section-divider" />

                       {/* Input area */}
            <div className="p-4 flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills, experience..."
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-transparent text-sm py-2 px-3 focus:outline-none placeholder:text-muted-foreground",
                  "max-h-28 overflow-y-auto"
                )}
                disabled={isLoading}
              />
              
              {messages.length > 0 && (
                <button
                  onClick={reset}
                  disabled={isLoading}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw size={18} />
                </button>
              )}

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-foreground text-background rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
