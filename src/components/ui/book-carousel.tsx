"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, X, Star } from "lucide-react";
import { ContentItem } from "@/components/ui/content-card";
import Link from "next/link";

interface BookCarouselProps {
  items: ContentItem[];
}

const cardThemes = [
  { bg: "#203c73", text: "#ffffff", mutedText: "rgba(255,255,255,0.7)" }, // Blue
  { bg: "#2b3a2e", text: "#ffffff", mutedText: "rgba(255,255,255,0.7)" }, // Dark Green
  { bg: "#9fb7a7", text: "#1a1715", mutedText: "rgba(26,23,21,0.7)" },     // Light Green
  { bg: "#a32626", text: "#ffffff", mutedText: "rgba(255,255,255,0.7)" }, // Red
  { bg: "#dce319", text: "#1a1715", mutedText: "rgba(26,23,21,0.7)" },     // Yellow
];

// Fixed pixel widths for desktop cards
const CARD_W = 300;
const CARD_GAP = 24;

// ── Review Modal ──────────────────────────────────────────────
function BookModal({
  item,
  theme,
  onClose,
}: {
  item: ContentItem;
  theme: (typeof cardThemes)[0];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ backgroundColor: theme.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/40"
          style={{ backgroundColor: "rgba(0,0,0,0.2)", color: theme.text }}
        >
          <X size={16} />
        </button>

        <div className="relative w-full h-56">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, ${theme.bg} 100%)`,
            }}
          />
        </div>

        <div className="px-6 pb-8 -mt-3 relative">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: theme.mutedText }}>
            {item.author}
          </p>
          <h2 className="font-serif font-bold text-2xl leading-tight mb-2" style={{ color: theme.text }}>
            {item.title}
          </h2>

          <div className="flex items-center gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={13} fill={theme.text} style={{ color: theme.text, opacity: 0.75 }} />
            ))}
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>
            {item.description || "No description available for this review yet."}
          </p>

          <Link
            href={item.url}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "rgba(0,0,0,0.15)",
              color: theme.text,
              border: `1px solid ${theme.text}30`,
            }}
          >
            View Full Review <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Carousel ─────────────────────────────────────────────
export function BookCarousel({ items }: BookCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, setModal] = useState<{ item: ContentItem; theme: (typeof cardThemes)[0] } | null>(null);

  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  if (!items || items.length === 0) return null;

  const prev = () => setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  const onPointerDown = (x: number) => { dragStartX.current = x; didDrag.current = false; };
  const onPointerMove = (x: number) => { if (dragStartX.current !== null && Math.abs(x - dragStartX.current) > 8) didDrag.current = true; };
  const onPointerUp = (x: number) => {
    if (dragStartX.current === null) return;
    const delta = x - dragStartX.current;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
    dragStartX.current = null;
  };

  return (
    <>
      {modal && <BookModal item={modal.item} theme={modal.theme} onClose={() => setModal(null)} />}

      <div className="w-full flex flex-col items-center select-none overflow-hidden pb-10">
        <div className="w-full mb-6 px-4 md:px-0 text-left flex items-center justify-between">
          <h2 className="font-sans font-black tracking-tighter uppercase text-4xl text-[#1a1715] dark:text-white">
            BOOK REVIEWS
          </h2>
        </div>

        {/* ══════════════════ DESKTOP CAROUSEL (INFINITE LOOP) ══════════════════ */}
        <div
          className="hidden md:flex relative w-full py-12 cursor-grab active:cursor-grabbing justify-center overflow-visible"
          style={{ height: "580px", alignItems: "center" }}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={(e) => onPointerUp(e.clientX)}
          onMouseLeave={(e) => { if (dragStartX.current !== null) onPointerUp(e.clientX); }}
        >
          <div className="relative w-[300px] h-[480px]">
            {items.map((item, idx) => {
              // Calculate wrapping diff so the stack feels infinite
              let diff = idx - activeIndex;
              if (items.length > 2) {
                if (diff > items.length / 2) diff -= items.length;
                if (diff < -items.length / 2) diff += items.length;
              }

              const absDiff = Math.abs(diff);
              // Hide items that are too far away
              if (absDiff > 3) return null;

              const theme = cardThemes[idx % cardThemes.length];
              const isActive = diff === 0;

              // Calculate positions (CARD_W + CARD_GAP = 324)
              const translateX = diff * 324;
              const scale = isActive ? 1.05 : 0.95;
              const opacity = absDiff === 0 ? 1 : absDiff === 1 ? 0.6 : 0.3;
              const zIndex = 30 - absDiff;

              return (
                <div
                  key={item.id}
                  onClick={() => { if (!didDrag.current) setActiveIndex(idx); }}
                  className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: theme.bg,
                    zIndex,
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    boxShadow: isActive ? "0 24px 48px rgba(0,0,0,0.25)" : "0 8px 16px rgba(0,0,0,0.1)",
                    cursor: isActive ? "default" : "pointer",
                    transformOrigin: "center center",
                  }}
                >
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div
                      className="rounded-xl overflow-hidden shadow-xl transition-all duration-500"
                      style={{
                        width: isActive ? "160px" : "130px",
                        height: isActive ? "240px" : "195px",
                      }}
                    >
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" draggable={false} />
                    </div>
                  </div>
                  <div className="px-6 pb-8">
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: theme.mutedText }}>
                      {item.author}
                    </p>
                    <h3 className="font-serif font-bold leading-snug" style={{ color: theme.text, fontSize: isActive ? "20px" : "16px" }}>
                      {item.title}
                    </h3>
                    {isActive && item.description && (
                      <p className="text-xs mt-2 leading-relaxed line-clamp-3" style={{ color: theme.mutedText }}>
                        {item.description}
                      </p>
                    )}
                    {isActive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setModal({ item, theme }); }}
                        className="mt-4 text-[12px] font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
                        style={{ color: theme.text }}
                      >
                        Read Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════ MOBILE STACKED DECK ══════════════════ */}
        <div
          className="md:hidden w-full flex justify-center py-6 cursor-grab active:cursor-grabbing"
          style={{ height: "540px" }}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={(e) => onPointerUp(e.clientX)}
          onMouseLeave={(e) => { if (dragStartX.current !== null) onPointerUp(e.clientX); }}
        >
          <div className="relative w-full max-w-[290px] h-full">
            {items.map((item, idx) => {
              // Calculate wrapping diff so the stack feels infinite
              let diff = idx - activeIndex;
              if (items.length > 3) {
                if (diff > items.length / 2) diff -= items.length;
                if (diff < -items.length / 2) diff += items.length;
              }
              
              const absDiff = Math.abs(diff);
              if (absDiff > 3) return null;

              const theme = cardThemes[idx % cardThemes.length];
              const isActive = idx === activeIndex;

              // True stacked deck geometry without rotation, exactly matching Image 2
              const translateX = diff * 28;       
              const scale = 1 - absDiff * 0.06;   
              const zIndex = 30 - absDiff;
              const opacity = absDiff > 3 ? 0 : 1;

              return (
                <div
                  key={item.id}
                  onClick={() => { if (!didDrag.current) setActiveIndex(idx); }}
                  className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: theme.bg,
                    zIndex,
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    boxShadow: isActive ? "0 24px 48px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)",
                    cursor: isActive ? "default" : "pointer",
                    transformOrigin: "center center",
                  }}
                >
                  <div className="flex-1 flex items-center justify-center pt-8 pb-4">
                    <div className="w-36 h-52 rounded-md overflow-hidden shadow-xl">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" draggable={false} />
                    </div>
                  </div>
                  <div className="px-6 pb-8">
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: theme.mutedText }}>
                      {item.author}
                    </p>
                    <h3 className="font-serif font-bold text-[22px] leading-tight" style={{ color: theme.text }}>
                      {item.title}
                    </h3>
                    {isActive && item.description && (
                      <p className="text-[13px] mt-2.5 leading-relaxed line-clamp-2" style={{ color: theme.mutedText }}>
                        {item.description}
                      </p>
                    )}
                    {isActive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setModal({ item, theme }); }}
                        className="mt-4 text-xs font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
                        style={{ color: theme.text }}
                      >
                        Read Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Previous"
          >
            <ArrowLeft size={18} className="text-[#1a1715] dark:text-white" />
          </button>
          
          {/* Read All Reviews link placed cleanly between or below */}
          <Link
            href="/books-reviews"
            className="text-sm font-bold text-[#1a1715] dark:text-white hover:opacity-60 transition-opacity"
          >
            View All Reviews →
          </Link>

          <button
            onClick={next}
            className="w-11 h-11 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Next"
          >
            <ArrowRight size={18} className="text-[#1a1715] dark:text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
