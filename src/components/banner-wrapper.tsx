"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export function BannerWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide the global banner on specific pages, and on ANY single detail page
  const isDetailPage = pathname.split('/').length > 2;
  const hidePaths = ['/sermons-podcasts', '/blog-series', '/events', '/books-reviews'];
  
  if (hidePaths.includes(pathname) || isDetailPage) {
    return null;
  }
  
  return <>{children}</>;
}
