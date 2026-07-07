"use client";

import React, { useState } from "react";
import { ContentItem } from "@/components/ui/content-card";
import { Play } from "lucide-react";

function getYoutubeEmbedUrl(url: string) {
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const parts = url.split("?");
    if (parts.length > 1) {
      videoId = new URLSearchParams(parts[1]).get("v") || "";
    }
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0` : url;
}

export function SermonSection({ sermons }: { sermons: ContentItem[] }) {
  const [selectedSermon, setSelectedSermon] = useState<ContentItem | null>(sermons[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // When a new sermon is selected from the grid, stop playing so it shows the cover first,
  // or auto-play it? The user said "when i click on the sermon the sermon gets played on the upper video area".
  // So auto-play makes sense!
  const handleSelectSermon = (sermon: ContentItem) => {
    setSelectedSermon(sermon);
    setIsPlaying(true);
    // scroll to top of section smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!sermons || sermons.length === 0) return null;

  return (
    <div className="w-full flex flex-col pb-16">
      {/* FEATURED SERMON PLAYER */}
      {selectedSermon && (
        <div className="w-full bg-[#1a1715] relative group">
          <div className="w-full aspect-video max-h-[75vh] relative overflow-hidden bg-black flex items-center justify-center">
            {isPlaying && selectedSermon.videoUrl ? (
              <iframe 
                src={getYoutubeEmbedUrl(selectedSermon.videoUrl)}
                className="w-full h-full absolute inset-0 z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
                {/* Cover Image */}
                <img 
                  src={selectedSermon.imageUrl} 
                  alt={selectedSermon.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Overlay Text (matching the Radical design) */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-12 md:pb-16 w-full">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex-1 max-w-4xl">
                      <h2 className="font-serif font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4 drop-shadow-lg">
                        {selectedSermon.title}
                      </h2>
                    </div>
                    <div className="flex-1 max-w-xl">
                      <p className="text-white/90 text-sm md:text-base leading-relaxed drop-shadow-md">
                        {selectedSermon.description || "Watch our latest featured sermon message."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <Play size={32} fill="currentColor" className="text-white ml-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SERMONS GRID */}
      <div className="px-4 md:px-8 py-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <button className="px-5 py-1.5 rounded-full bg-[#1a1715] dark:bg-white text-white dark:text-[#1a1715] text-sm font-semibold whitespace-nowrap">
            All
          </button>
          <button className="px-5 py-1.5 rounded-full border border-black/20 dark:border-white/20 text-[#1a1715] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium whitespace-nowrap transition-colors">
            Topic
          </button>
          <button className="px-5 py-1.5 rounded-full border border-black/20 dark:border-white/20 text-[#1a1715] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium whitespace-nowrap transition-colors">
            Year
          </button>
          <button className="px-5 py-1.5 rounded-full border border-black/20 dark:border-white/20 text-[#1a1715] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium whitespace-nowrap transition-colors">
            Author
          </button>
        </div>
        
        <div className="grid grid-rows-1 md:grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[300px] md:auto-cols-[280px] gap-x-6 gap-y-12 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar scroll-smooth">
          {sermons.map((sermon) => (
            <div 
              key={sermon.id}
              onClick={() => handleSelectSermon(sermon)}
              className="group cursor-pointer flex flex-col snap-start"
            >
              <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-4">
                <img src={sermon.imageUrl} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={14} fill="currentColor" className="text-[#1a1715] ml-0.5" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="font-serif italic text-sm tracking-wide text-[#1a1715]/60 dark:text-white/60 mb-2">
                  {sermon.author}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1715] dark:text-white leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-1">
                  {sermon.title}
                </h3>
                <p className="text-sm text-[#1a1715]/70 dark:text-white/70 line-clamp-2 leading-relaxed">
                  {sermon.description || "Watch this powerful message."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
