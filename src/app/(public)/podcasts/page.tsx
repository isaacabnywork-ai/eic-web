import { getAllContent } from "@/lib/db";
import { PodcastSection } from "@/components/ui/podcast-section";

export default async function PodcastsArchivePage() {
  const allContent = await getAllContent('sermon_podcast');
  const podcasts = allContent.filter(item => item.audioUrl);

  return (
    <div className="w-full min-h-screen bg-[#1a1715] pt-20 pb-12">
      <PodcastSection podcasts={podcasts} />
      
      {podcasts.length === 0 && (
        <div className="text-center text-text-muted py-20">
          No podcasts found.
        </div>
      )}
    </div>
  );
}
