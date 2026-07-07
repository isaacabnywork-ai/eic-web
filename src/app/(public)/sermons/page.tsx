import { getAllContent } from "@/lib/db";
import { SermonGrid } from "@/components/ui/sermon-grid";

export default async function SermonsArchivePage() {
  const allContent = await getAllContent('sermon_podcast');
  const sermons = allContent.filter(item => item.videoUrl);

  return (
    <div className="w-full bg-[#1a1715] min-h-screen">
      <div className="px-4 md:px-8 py-8 lg:py-24 pt-24 w-full">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-white mb-6 leading-tight">
            SERMONS
          </h1>
          <p className="text-white/70 max-w-2xl">
            Browse our entire collection of past sermons.
          </p>
        </div>
        
        {/* We reuse SermonGrid, but without the "See All" header since we are already on the archive */}
        <SermonGrid items={sermons} hideHeader />
        
        {sermons.length === 0 && (
          <div className="text-center text-white/50 py-20">
            No sermons found.
          </div>
        )}
      </div>
    </div>
  );
}
