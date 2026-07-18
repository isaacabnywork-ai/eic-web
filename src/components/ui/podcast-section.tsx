"use client";

import React, { useState } from "react";
import { ContentItem } from "@/components/ui/content-card";
import { FeaturedPodcastPlayer } from "./featured-podcast-player";
import { Play } from "lucide-react";
import Link from "next/link";
import { getYoutubeThumbnailUrl } from "@/lib/youtube";

export function PodcastSection({ podcasts, hideHeader = false, title = "PODCASTS" }: { podcasts: ContentItem[], hideHeader?: boolean, title?: string }) {
  const [selectedPodcast, setSelectedPodcast] = useState<ContentItem | null>(podcasts[0] || null);

  if (!podcasts || podcasts.length === 0) return null;

  return (
    <div className="w-full flex flex-col pt-12">
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 md:px-8 mb-6 w-full max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1715] dark:text-white tracking-wide uppercase">
            {title}
          </h2>
          <Link href="/podcasts" className="text-[#1a1715]/70 dark:text-white/70 hover:text-[#1a1715] dark:hover:text-white text-sm font-semibold transition-colors hidden">
            See All
          </Link>
        </div>
      )}

      {selectedPodcast && <FeaturedPodcastPlayer podcast={selectedPodcast} type={title} />}

      <div className="px-4 md:px-8 py-12 w-full max-w-7xl mx-auto">
        <h3 className="font-serif italic tracking-wide text-sm text-[#1a1715]/50 dark:text-white/50 mb-6">
          Recent Media
        </h3>
        
        <div className="grid grid-rows-1 md:grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] gap-x-6 gap-y-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar scroll-smooth">
          {podcasts.map((podcast) => (
            <div 
              key={podcast.id}
              onClick={() => setSelectedPodcast(podcast)}
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer snap-start transition-all ${selectedPodcast?.id === podcast.id ? 'bg-[#1a1715]/5 dark:bg-white/10 ring-1 ring-[#1a1715]/10 dark:ring-white/20' : 'hover:bg-[#1a1715]/5 dark:hover:bg-white/5'}`}
            >
              <div className="w-16 h-16 shrink-0 rounded overflow-hidden relative group bg-[#1a1715]/5 dark:bg-white/5 flex items-center justify-center">
                {(podcast.imageUrl || (podcast.videoUrl && getYoutubeThumbnailUrl(podcast.videoUrl))) ? (
                  <img src={podcast.imageUrl || (podcast.videoUrl ? getYoutubeThumbnailUrl(podcast.videoUrl) : "")!} alt={podcast.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-serif text-[#1a1715]/20 dark:text-white/20">No Cover</span>
                )}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${selectedPodcast?.id === podcast.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Play size={16} fill="currentColor" className="text-white ml-0.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif italic text-sm tracking-wide text-[#1a1715]/50 dark:text-white/50 mb-1">
                  {podcast.author}
                </span>
                <h4 className="font-serif font-bold text-[#1a1715] dark:text-white text-sm leading-tight line-clamp-2">
                  {podcast.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
