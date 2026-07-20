import { getContentById, getAllContent, getContentBySlug, getAllContentItems } from "@/lib/db";
import { FeaturedPodcastPlayer } from "@/components/ui/featured-podcast-player";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";

import { HorizontalRow } from "@/components/ui/horizontal-row";

export default async function PodcastSinglePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Try to find as a standard podcast first
  let podcast = await getContentBySlug('podcast', resolvedParams.id);
  
  // If not found, it might be a sermon_podcast that is being displayed in the Podcasts tab
  if (!podcast) {
    podcast = await getContentBySlug('sermon_podcast', resolvedParams.id, 'podcasts');
  }
  
  if (!podcast) {
    // Let's just try to find ANY content that matches this slug at the end of its URL
    const allContent = await getAllContentItems();
    podcast = allContent.find(c => c.url?.endsWith(resolvedParams.id)) || null;
  }
  
  if (!podcast) {
    notFound();
  }

  // Fetch all other podcasts
  const allPodcasts = await getAllContent('podcast');
  
  // Filter out the current one
  const otherPodcasts = allPodcasts
    .filter(item => item.id !== podcast.id)
    .slice(0, 8); // show up to 8 related episodes

  return (
    <div className="w-full bg-bg-main min-h-screen pt-20">
      
      {/* Featured Player for this specific episode */}
      <FeaturedPodcastPlayer podcast={podcast} />

      {/* List of other episodes */}
      {otherPodcasts.length > 0 && (
        <div className="px-4 md:px-8 py-16 w-full max-w-7xl mx-auto">
          <HorizontalRow 
            title="More Episodes" 
            items={otherPodcasts} 
            aspectRatio="video"
          />
        </div>
      )}

    </div>
  );
}
