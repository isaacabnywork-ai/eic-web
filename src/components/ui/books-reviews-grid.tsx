"use client";

import React, { useState } from "react";
import { ContentItem } from "@/components/ui/content-card";
import { X, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BooksGridProps {
  items: ContentItem[];
}

export function BooksReviewsGrid({ items }: BooksGridProps) {
  const [selectedBook, setSelectedBook] = useState<ContentItem | null>(null);

  if (!items || items.length === 0) {
    return <div className="text-center py-20 text-text-muted">No book reviews found.</div>;
  }

  return (
    <>
      {selectedBook && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
          onClick={() => setSelectedBook(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <div
            className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-[#f8f7f5] dark:bg-[#1a1715] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-[#1a1715] dark:text-white"
            >
              <X size={16} />
            </button>

            {/* Hero image gradient fade */}
            <div className="relative w-full h-[280px]">
              <img src={selectedBook.imageUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8f7f5] dark:to-[#1a1715]"
              />
            </div>

            {/* Body */}
            <div className="px-8 pb-8 -mt-6 relative">
              <p className="font-serif italic text-sm tracking-wide mb-1.5 text-[#1a1715]/60 dark:text-white/60">
                {selectedBook.author}
              </p>
              <h2 className="font-serif font-bold text-[28px] leading-tight mb-3 text-[#1a1715] dark:text-white">
                {selectedBook.title}
              </h2>

              <div className="flex items-center gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" className="text-[#1a1715]/80 dark:text-white/80" />
                ))}
              </div>

              <div className="max-h-[25vh] overflow-y-auto mb-8 pr-3 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                <p className="text-[15px] leading-relaxed text-[#1a1715]/80 dark:text-white/80 whitespace-pre-line">
                  {selectedBook.description || "No description available for this review yet."}
                </p>
              </div>

              <Link
                href={selectedBook.url}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 bg-[#1a1715] dark:bg-white text-white dark:text-[#1a1715] shadow-lg"
              >
                Read Full Article <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col group">
            {/* Book Cover */}
            <div className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] mb-5 bg-gray-100 relative group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] transition-shadow duration-300">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Details */}
            <h3 className="font-serif font-bold text-[17px] leading-snug text-text-main mb-1.5 line-clamp-2">
              {item.title}
            </h3>
            <p className="font-serif italic text-sm tracking-wide text-text-muted mb-5 line-clamp-1">
              {item.author}
            </p>
            
            {/* Read Review Button */}
            <div className="mt-auto">
              <button
                onClick={() => setSelectedBook(item)}
                className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-border-main text-text-main hover:bg-text-main hover:text-bg-main transition-colors w-full text-center"
              >
                Read Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
