"use client";

import React, { useState, useRef, useEffect } from "react";
import { ContentItem } from "@/components/ui/content-card";
import { getYoutubeThumbnailUrl, getYoutubeEmbedUrl } from "@/lib/youtube";
import { Play, Pause, RotateCcw, RotateCw, Download, ChevronDown, Headphones } from "lucide-react";
import Link from "next/link";

interface FeaturedPodcastPlayerProps {
  podcast: ContentItem;
  type?: string;
}

export function FeaturedPodcastPlayer({ podcast, type = "PODCASTS" }: FeaturedPodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Playback prevented:", error);
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1; // avoid NaN
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const skip = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const toggleSpeed = () => {
    setSpeed(prev => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#e8e9e6] dark:bg-[#1f1b19] relative overflow-hidden py-16 px-6 md:px-12 border-y border-black/10 dark:border-white/10 transition-colors duration-300">
      {/* Decorative textured background overlay could go here */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

      <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-center">
        
        {/* Left Column - Branding */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center md:justify-end">
          <div className="flex flex-col items-center md:items-start">
            <p className="font-serif italic text-sm tracking-wide text-black/50 dark:text-white/50 mb-6 text-center md:text-left">
              {type === "VIDEOS" ? "Featured Video" : "Featured Podcast"}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1715] dark:text-white leading-tight text-center md:text-left mb-6">
              {podcast.author}
            </h2>
            <button className="bg-[#1a1715] dark:bg-white text-white dark:text-[#1a1715] text-xs font-bold uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-colors">
              Subscribe <ChevronDown size={14} />
            </button>
          </div>
          <div className="w-72 md:w-96 aspect-video shrink-0 rounded-xl overflow-hidden shadow-2xl border border-black/5 bg-[#1a1715]/5 dark:bg-white/5 relative group">
            {!podcast.audioUrl && podcast.videoUrl ? (
              <iframe 
                src={getYoutubeEmbedUrl(podcast.videoUrl)}
                className="w-full h-full absolute inset-0 z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (podcast.imageUrl || (podcast.videoUrl && getYoutubeThumbnailUrl(podcast.videoUrl))) ? (
              <img src={podcast.imageUrl || (podcast.videoUrl ? getYoutubeThumbnailUrl(podcast.videoUrl) : "")!} alt={podcast.title} className="w-full h-full object-cover relative z-0" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1715]/10 to-[#1a1715]/30 dark:from-white/10 dark:to-white/5 p-4 text-center">
                <Headphones size={48} className="text-[#1a1715]/40 dark:text-white/40 mb-3 opacity-50" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1715]/60 dark:text-white/60 line-clamp-3">{podcast.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Player */}
        <div className="flex flex-col">
          <p className="font-serif italic text-sm tracking-wide text-black/50 dark:text-white/50 mb-2">
            {type === "VIDEOS" ? "Latest Video" : "Latest Episode"}
          </p>
          <h3 className="font-serif font-bold text-3xl md:text-4xl text-[#1a1715] dark:text-white mb-4">
            {podcast.title}
          </h3>
          <p className="text-[#1a1715]/70 dark:text-white/70 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            {podcast.description || `Listen to our latest featured ${type === "VIDEOS" ? "video" : "podcast"} below.`}
          </p>

          {/* Player UI */}
          <div className="w-full">
            {podcast.audioUrl ? (
              <>
                <audio 
                  ref={audioRef} 
                  src={podcast.audioUrl} 
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Progress Bar */}
                <div 
                  className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer relative mb-3 group"
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#1a1715] dark:bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1715] dark:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2 shadow-sm" />
                  </div>
                </div>

                {/* Time Indicators */}
                <div className="flex justify-between text-[11px] font-mono text-black/50 dark:text-white/50 mb-6">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="w-16"></div> {/* Spacer for centering */}
                  
                  <div className="flex items-center gap-6 md:gap-8">
                    <button onClick={() => skip(-15)} className="text-[#1a1715] dark:text-white hover:opacity-70 transition-opacity relative">
                      <RotateCcw size={22} strokeWidth={1.5} />
                      <span className="absolute top-[10px] left-[5px] text-[8px] font-bold">15</span>
                    </button>
                    
                    <button 
                      onClick={togglePlay} 
                      className="w-16 h-16 rounded-full border border-[#1a1715]/20 dark:border-white/20 flex items-center justify-center text-[#1a1715] dark:text-white hover:bg-[#1a1715] dark:hover:bg-white hover:text-white dark:hover:text-[#1a1715] transition-all transform hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? (
                        <Pause fill="currentColor" size={24} />
                      ) : (
                        <Play fill="currentColor" size={24} className="ml-1" />
                      )}
                    </button>
                    
                    <button onClick={() => skip(15)} className="text-[#1a1715] dark:text-white hover:opacity-70 transition-opacity relative">
                      <RotateCw size={22} strokeWidth={1.5} />
                      <span className="absolute top-[10px] left-[4px] text-[8px] font-bold">30</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-black/50 dark:text-white/50 w-16 justify-end">
                    <button onClick={toggleSpeed} className="w-7 h-7 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-[9px] font-bold text-[#1a1715] dark:text-white hover:border-black/40 dark:hover:border-white/40">
                      {speed}x
                    </button>
                    {podcast.videoUrl && (
                      <Link href={podcast.videoUrl} target="_blank" className="hover:text-[#1a1715] dark:hover:text-white transition-colors">
                        <Download size={16} strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                </div>
              </>
            ) : podcast.videoUrl ? (
              <div className="flex flex-col items-center justify-center p-6 border border-black/10 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5 mt-2">
                <Play size={28} className="text-black/30 dark:text-white/30 mb-3" />
                <p className="text-sm font-medium text-black/60 dark:text-white/60 text-center leading-relaxed">
                  This episode is available in video format.<br/>
                  Play the video to listen.
                </p>
              </div>
            ) : null}
          </div>

          {podcast.videoUrl && (
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-black/50 hover:text-black/80 transition-colors uppercase tracking-wider">
              <Link href={podcast.videoUrl} target="_blank" className="flex items-center gap-2">
                <div className="w-6 h-4 bg-red-600 rounded flex items-center justify-center text-white">
                  <Play size={10} fill="currentColor" />
                </div>
                Watch on YouTube
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
