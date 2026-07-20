"use client"
import React, { useState, useEffect } from 'react';
import { ContentItem } from './content-card';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { Play } from 'lucide-react';
import Link from 'next/link';

export function HeroCarousel({ items }: { items: ContentItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const handlePlay = (e: React.MouseEvent, item: ContentItem) => {
    e.preventDefault();
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
    <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden group bg-black">
      {items.map((item, index) => (
        <div 
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:from-black/80 md:via-black/20 md:bg-gradient-to-r md:to-transparent" />
          
          <div className="absolute inset-0 max-w-7xl mx-auto flex items-end pb-8 md:pb-12 px-4 md:px-8 pointer-events-none">
            <div className="w-full md:w-2/3 pointer-events-auto">
              <span className="font-serif italic text-sm tracking-wide text-accent mb-2 block uppercase">
                Exclusive
              </span>
              <h2 className="font-serif font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4 drop-shadow-lg">
                {item.title}
              </h2>
              <p className="text-gray-300 md:text-lg mb-6 line-clamp-2">
                By {item.author}
              </p>
              
              <div className="flex gap-4">
                {item.audioUrl && (
                  <button 
                    onClick={(e) => handlePlay(e, item)}
                    className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Play size={20} fill="currentColor" />
                    Listen Now
                  </button>
                )}
                <Link 
                  href={item.url}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-accent w-6' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
