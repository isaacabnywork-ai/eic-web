"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ContentCard, ContentItem } from "@/components/ui/content-card";
import { getUserBookmarks } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<ContentItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      getUserBookmarks(user.uid)
        .then((items) => {
          setBookmarks(items);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="px-4 md:px-8 py-8 lg:py-24 max-w-[1400px] mx-auto pt-24 min-h-[80vh] flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading Library...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-4 md:px-8 py-8 lg:py-24 max-w-[1400px] mx-auto pt-24 min-h-[80vh]">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-sans font-black tracking-tighter uppercase text-4xl md:text-5xl lg:text-7xl text-text-main mb-6 leading-[0.85]">My Library</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center text-text-muted py-20 border border-border border-dashed rounded-xl">
          <p className="mb-4">Your library is currently empty.</p>
          <p className="text-sm">Explore sermons and articles and click "Save to Library" to add them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {bookmarks.map((item) => (
            <ContentCard 
              key={item.id} 
              item={item} 
              aspectRatio={item.type === 'blog_series' || item.type === 'book_review' ? 'portrait' : item.type === 'sermon_podcast' ? 'video' : 'square'} 
              className="w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
