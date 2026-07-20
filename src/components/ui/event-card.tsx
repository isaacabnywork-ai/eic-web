"use client";

import React from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { ContentItem } from './content-card';

export function EventCard({ item }: { item: ContentItem }) {
  // Use a random or extracted date if none is provided for the mockup
  const displayDate = item.date || "UPCOMING EVENT";
  const dotColor = item.color || "#e11d48"; // Default to a nice rose red

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implementation for share popup could go here
    if (navigator.share) {
      navigator.share({
        title: item.title,
        url: item.url,
      }).catch(console.error);
    }
  };

  return (
    <Link href={item.url || `/events/${item.id}`} className="group block w-full flex-shrink-0 snap-start h-full">
      <div className="bg-bg-elevated border border-border-main rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
        
        {/* Date Banner */}
        <div className="bg-[#1a1715] dark:bg-white px-5 py-3 flex items-center justify-between">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-white dark:text-[#1a1715]">
            {displayDate}
          </span>
        </div>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black/5 dark:bg-white/5">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="font-serif font-bold text-text-main text-lg md:text-xl leading-tight line-clamp-2">
              {item.title}
            </h3>
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2" 
              style={{ backgroundColor: dotColor }}
            />
          </div>

          <div className="mt-auto">
            <hr className="border-border-main mb-4" />
            <div className="flex items-center justify-between">
              <button 
                onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded border border-border-main text-text-muted hover:text-accent hover:border-accent transition-colors"
                aria-label="Share event"
              >
                <Share2 size={16} />
              </button>
              
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors border border-border-main px-4 py-2 rounded hover:border-text-main">
                View Detail
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
