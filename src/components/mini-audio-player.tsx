"use client"
import React from 'react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { Play, Pause, X } from 'lucide-react';

export function MiniAudioPlayer() {
  const { currentTrack, isPlaying, progress, togglePlayPause } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px] bg-card-bg border border-border-main rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02]">
      {/* Progress Bar */}
      <div className="h-1 bg-border-main w-full">
        <div 
          className="h-full bg-accent transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-3 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {currentTrack.imageUrl ? (
            <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-border-main flex-shrink-0" />
          )}
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-text-main truncate">{currentTrack.title}</p>
            <p className="text-xs text-text-muted truncate mt-0.5">{currentTrack.author}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            onClick={togglePlayPause}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white transition-colors"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
