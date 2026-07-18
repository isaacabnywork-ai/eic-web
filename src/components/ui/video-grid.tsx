"use client";

import React from "react";
import { ContentItem } from "@/components/ui/content-card";
import Link from "next/link";
import { Play } from "lucide-react";

interface VideoGridProps {
  items: ContentItem[];
  hideHeader?: boolean;
}

export function VideoGrid({ items, hideHeader = false }: VideoGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      {!hideHeader && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1715] dark:text-white tracking-wide capitalize">
            VIDEOS
          </h2>
          <Link href="/videos-podcasts" className="text-[#1a1715]/70 dark:text-white/70 hover:text-[#1a1715] dark:hover:text-white text-sm font-semibold transition-colors">
            See All
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {items.map((item) => (
          <Link href={`/videos-podcasts/${item.id}`} key={item.id} className="group block">
            <div className="w-full aspect-square relative overflow-hidden bg-white/5 rounded-md mb-4 shadow-lg">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                  <Play size={20} className="text-white ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            
            <h3 className="font-serif font-bold text-[#1a1715] dark:text-white text-[15px] leading-tight mb-1.5 line-clamp-2">
              {item.title}
            </h3>
            <p className="font-serif italic text-sm tracking-wide text-[#1a1715]/60 dark:text-white/60">
              {item.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
