"use client"
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { ContentItem } from '@/components/ui/content-card';

export function SermonPlayButton({ item }: { item: ContentItem }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();

  const isCurrentTrack = currentTrack?.id === item.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else if (item.audioUrl) {
      playTrack({
        id: item.id,
        title: item.title,
        author: item.author,
        audioUrl: item.audioUrl,
        imageUrl: item.imageUrl,
      });
    }
  };

  if (!item.audioUrl) return null;

  return (
    <button 
      onClick={handlePlay}
      className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors shadow-lg"
    >
      {isCurrentTrack && isPlaying ? (
        <>
          <Pause size={20} fill="currentColor" />
          <span>Pause Sermon</span>
        </>
      ) : (
        <>
          <Play size={20} fill="currentColor" />
          <span>Listen Now</span>
        </>
      )}
    </button>
  );
}
