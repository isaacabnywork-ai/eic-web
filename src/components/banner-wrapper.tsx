"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export function BannerWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide the global banner on the sermons-podcasts page, and on ANY single detail page
  const isDetailPage = pathname.split('/').length > 2;
  
  if (pathname === '/sermons-podcasts' || isDetailPage) {
    return null;
  }
  
  return <>{children}</>;
}
