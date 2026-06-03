"use client";
// app/gallery/GalleryGrid.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
}

const CATEGORIES = ["all", "bts", "events", "creative", "work"];

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center border-2 border-dashed border-border rounded-2xl">
        <span className="text-4xl">🖼️</span>
        <div>
          <p className="font-semibold text-foreground text-lg">Gallery coming soon</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Upload images via{" "}
            <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/admin</code>
            {" "}and they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 p-1.5 bg-secondary rounded-full border border-border">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150",
                filter === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "bts" ? "Behind the Scenes" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => setLightbox(item)}
          >
            <div className="card-surface overflow-hidden hover:shadow-card-hover transition-all duration-300">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn
                    size={24}
                    className="text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="p-4">
                <p className="font-semibold text-sm text-foreground leading-tight">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.category && (
                  <span className="inline-block mt-2 text-xs text-muted-foreground capitalize">
                    {item.category === "bts" ? "Behind the Scenes" : item.category}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
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
              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.imageUrl}
                  alt={lightbox.title}
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>

              {/* Caption */}
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
