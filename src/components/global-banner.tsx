import React from 'react';
import { HeroCarousel } from './ui/hero-carousel';
import { getFeaturedContent } from '@/lib/db';

export async function GlobalBanner() {
  const featuredItems = await getFeaturedContent();
  
  if (!featuredItems || featuredItems.length === 0) {
    return null;
  }
  
  return <HeroCarousel items={featuredItems} />;
}
