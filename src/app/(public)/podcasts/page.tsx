import { getAllContent } from "@/lib/db";
import { PodcastSection } from "@/components/ui/podcast-section";

export default async function PodcastsPage() {
  const sermonPodcasts = await getAllContent('sermon_podcast');
  const podcastsOnly = await getAllContent('podcast');
  
  // Combine both old video-podcasts and new pure podcasts
  const allContent = [...sermonPodcasts, ...podcastsOnly];

  // Only show items that actually have an audioUrl, OR are explicitly type 'podcast'
  const podcasts = allContent.filter(item => item.audioUrl || item.type === 'podcast');

  return (
    <div className="w-full bg-[#f8f7f5] dark:bg-[#1a1715] min-h-screen pb-20 transition-colors duration-300">
      {podcasts.length > 0 ? (
        <div className="w-full pb-16">
          <PodcastSection podcasts={podcasts} title="PODCASTS" />
        </div>
      ) : (
        <div className="text-center text-text-muted py-20">
          No podcasts found.
        </div>
      )}
    </div>
  );
}
