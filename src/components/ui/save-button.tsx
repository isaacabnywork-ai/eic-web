"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ContentItem } from "@/components/ui/content-card";
import { toggleBookmark, checkIsBookmarked } from "@/lib/db";
import { useRouter } from "next/navigation";

export function SaveButton({ item }: { item: ContentItem }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsBookmarked(user.uid, item.id).then(setIsSaved);
    } else {
      setIsSaved(false);
    }
  }, [user, item.id]);

  const handleToggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const saved = await toggleBookmark(user.uid, item);
      setIsSaved(saved);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
        isSaved 
          ? "bg-border text-text-main hover:bg-border/80" 
          : "bg-white text-black hover:bg-gray-200"
      }`}
    >
      {isSaved ? (
        <>
          <BookmarkCheck size={20} className="text-accent" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark size={20} />
          <span>Save to Library</span>
        </>
      )}
    </button>
  );
}
