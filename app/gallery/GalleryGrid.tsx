"use client";
// app/gallery/GalleryGrid.tsx
//
// No top category nav — categories render as headings, each with its own
// horizontally-scrollable rail beneath it. Supports images and videos.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  mediaType?: string | null; // "IMAGE" | "VIDEO"
  thumbnailUrl?: string | null;
  category?: string | null;
}

function labelFor(cat: string) {
  if (cat === "bts") return "Behind the Scenes";
  if (cat === "uncategorized") return "More";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center border-2 border-dashed border-border rounded-2xl">
        <span className="text-4xl">🖼️</span>
        <div>
          <p className="font-semibold text-foreground text-lg">Gallery coming soon</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Upload photos or videos via{" "}
            <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/admin</code>
            {" "}and they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  // Group items by category, preserving first-seen order; items with no
  // category fall into a trailing "More" rail instead of vanishing.
  const groups: { key: string; items: GalleryItem[] }[] = [];
  const indexOf = new Map<string, number>();
  for (const item of items) {
    const key = (item.category || "uncategorized").toLowerCase();
    if (!indexOf.has(key)) {
      indexOf.set(key, groups.length);
      groups.push({ key, items: [] });
    }
    groups[indexOf.get(key)!].items.push(item);
  }

  return (
    <>
      <div className="space-y-14">
        {groups.map((group) => (
          <section key={group.key} className="space-y-4">
            <h2 className="text-lg font-extrabold text-foreground">{labelFor(group.key)}</h2>

            {/* Horizontal scroll rail — swipe/scroll sideways, no top tab nav */}
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scroll-smooth">
              {group.items.map((item, i) => {
                const isVideo = item.mediaType === "VIDEO";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    className="group cursor-pointer flex-shrink-0 w-[240px] snap-start"
                    onClick={() => setLightbox(item)}
                  >
                    <div className="card-surface overflow-hidden hover:shadow-card-hover transition-all duration-300">
                      <div className="relative overflow-hidden aspect-[4/5] bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={isVideo ? item.thumbnailUrl || item.imageUrl : item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
                              <Play size={18} className="text-black ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3.5">
                        <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox — plays video inline, shows image full-size */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="rounded-2xl overflow-hidden bg-black">
                {lightbox.mediaType === "VIDEO" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={lightbox.imageUrl}
                    poster={lightbox.thumbnailUrl || undefined}
                    controls
                    autoPlay
                    className="w-full max-h-[75vh]"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lightbox.imageUrl}
                    alt={lightbox.title}
                    className="w-full max-h-[75vh] object-contain"
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-white font-semibold">{lightbox.title}</p>
                {lightbox.description && (
                  <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
