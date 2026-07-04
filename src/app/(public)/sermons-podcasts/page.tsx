import { getAllContent } from "@/lib/db";
import { SermonSection } from "@/components/ui/sermon-section";
import { PodcastSection } from "@/components/ui/podcast-section";

export default async function SermonsPodcastsPage() {
  const allContent = await getAllContent('sermon_podcast');

  const sermons = allContent.filter(item => item.videoUrl);
  const podcasts = allContent.filter(item => item.audioUrl);

  return (
    <div className="w-full bg-[#f8f7f5] dark:bg-[#1a1715] min-h-screen pb-20 transition-colors duration-300">
      {/* SERMONS SECTION */}
      {sermons.length > 0 && (
        <SermonSection sermons={sermons} />
      )}

      {/* PODCASTS SECTION */}
      {podcasts.length > 0 && (
        <div className="w-full pb-16">
          <PodcastSection podcasts={podcasts} />
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
