import { getAllContent } from "@/lib/db";
import { PodcastSection } from "@/components/ui/podcast-section";

export default async function VideosPodcastsPage() {
  const allContent = await getAllContent('sermon_podcast');

  return (
    <div className="w-full bg-[#f8f7f5] dark:bg-[#1a1715] min-h-screen pb-20 transition-colors duration-300">
      {allContent.length > 0 ? (
        <div className="w-full pb-16">
          <PodcastSection podcasts={allContent} />
        </div>
      ) : (
        <div className="text-center text-text-muted py-20">
          No content found.
        </div>
      )}
    </div>
  );
}
