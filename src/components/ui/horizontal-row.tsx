"use client"
import React, { useRef } from 'react';
import { ContentCard, ContentItem, ContentCardSkeleton } from './content-card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function HorizontalRow({ 
  title, 
  items, 
  isLoading = false,
  aspectRatio = 'video',
  seeAllUrl
}: { 
  title: string; 
  items: ContentItem[]; 
  isLoading?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait';
  seeAllUrl?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth + 100 : clientWidth - 100;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-bold text-text-main">{title}</h2>
        {seeAllUrl && (
          <Link href={seeAllUrl} className="text-accent text-sm font-semibold hover:underline">
            See All
          </Link>
        )}
      </div>

      <div className="relative group/row">
        {/* Navigation Buttons (Desktop only) */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-[calc(50%+24px)] -translate-x-4 z-10 w-10 h-10 bg-bg-elevated/80 backdrop-blur-sm border border-border-main text-text-main rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex hover:bg-bg-elevated hover:scale-105"
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ContentCardSkeleton key={i} aspectRatio={aspectRatio} />
            ))
          ) : (
            items.map((item) => (
              <ContentCard key={item.id} item={item} aspectRatio={aspectRatio} />
            ))
          )}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-[calc(50%+24px)] translate-x-4 z-10 w-10 h-10 bg-bg-elevated/80 backdrop-blur-sm border border-border-main text-text-main rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex hover:bg-bg-elevated hover:scale-105"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
