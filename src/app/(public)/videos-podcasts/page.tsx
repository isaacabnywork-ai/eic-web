import { getAllContent } from "@/lib/db";
import { PodcastSection } from "@/components/ui/podcast-section";

export default async function VideosPodcastsPage() {
  const allContent = await getAllContent('sermon_podcast');

  const videos = allContent.filter(item => item.videoUrl);
  const podcasts = allContent.filter(item => item.audioUrl);

  return (
    <div className="w-full bg-[#f8f7f5] dark:bg-[#1a1715] min-h-screen pb-20 transition-colors duration-300">
      {videos.length > 0 && (
        <div className="w-full pb-8">
          <PodcastSection podcasts={videos} title="VIDEOS" />
        </div>
      )}

      {podcasts.length > 0 && (
        <div className="w-full pb-16">
          <PodcastSection podcasts={podcasts} title="PODCASTS" />
        </div>
      )}
      
      {allContent.length === 0 && (
        <div className="text-center text-text-muted py-20">
          No content found.
        </div>
      )}
    </div>
  );
}
