"use client";
import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';

export type ContentItem = {
  id: string;
  title: string;
  type: 'sermon_podcast' | 'blog_series' | 'event' | 'book_review';
  author: string;
  imageUrl: string;
  url: string;
  description?: string;
  audioUrl?: string;
  videoUrl?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  showOnHome?: boolean;
};

export function ContentCard({ item, aspectRatio = 'video', className = 'flex-shrink-0 w-48 md:w-64 snap-start' }: { item: ContentItem; aspectRatio?: 'video' | 'square' | 'portrait', className?: string }) {
  const { playTrack } = useAudioPlayer();

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.audioUrl) {
      playTrack({
        id: item.id,
        title: item.title,
        author: item.author,
        audioUrl: item.audioUrl,
        imageUrl: item.imageUrl,
      });
    }
  };

  return (
    <Link href={item.url} className={`group/card block relative ${className}`}>
      <div className={`relative overflow-hidden bg-card-bg ${aspectClasses[aspectRatio]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        
        {item.isPremium && (
          <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Premium
          </div>
        )}

        {item.audioUrl && (
          <button 
            onClick={handlePlay}
            className="absolute bottom-3 right-3 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 shadow-lg"
          >
            <Play size={20} fill="currentColor" className="ml-1" />
          </button>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-text-main leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-sm text-text-muted mt-1">{item.author}</p>
      </div>
    </Link>
  );
}

export function ContentCardSkeleton({ aspectRatio = 'video' }: { aspectRatio?: 'video' | 'square' | 'portrait' }) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className="flex-shrink-0 w-48 md:w-64 snap-start animate-pulse">
      <div className={`bg-card-bg ${aspectClasses[aspectRatio]}`} />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-card-bg rounded w-3/4" />
        <div className="h-4 bg-card-bg rounded w-1/2" />
      </div>
    </div>
  );
}
