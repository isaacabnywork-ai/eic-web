import { getAllContent } from "@/lib/db";
import { VideoSection } from "@/components/ui/video-section";
export const dynamic = 'force-dynamic';

export default async function VideosPodcastsPage() {
  const allContent = await getAllContent('sermon_podcast');

  const videos = allContent;

  return (
    <div className="w-full bg-[#f8f7f5] dark:bg-[#1a1715] min-h-screen pb-20 transition-colors duration-300">
      {videos.length > 0 && (
        <VideoSection videos={videos} />
      )}
      
      {videos.length === 0 && (
        <div className="text-center text-text-muted py-20">
          No videos found.
        </div>
      )}
    </div>
  );
}
