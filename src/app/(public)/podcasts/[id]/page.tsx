import { getContentById, getAllContent } from "@/lib/db";
import { FeaturedPodcastPlayer } from "@/components/ui/featured-podcast-player";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";

export default async function PodcastSinglePage({ params }: { params: { id: string } }) {
  const podcast = await getContentById(params.id);
  
  if (!podcast || !podcast.audioUrl) {
    notFound();
  }

  // Fetch all other podcasts
  const allContent = await getAllContent('sermon_podcast');
  const otherPodcasts = allContent.filter(item => item.audioUrl && item.id !== podcast.id);

  return (
    <div className="w-full bg-bg-main min-h-screen pt-20">
      
      {/* Featured Player for this specific episode */}
      <FeaturedPodcastPlayer podcast={podcast} />

      {/* List of other episodes */}
      {otherPodcasts.length > 0 && (
        <div className="px-4 md:px-8 py-16 w-full max-w-7xl mx-auto">
          <h3 className="font-sans font-bold uppercase tracking-wider text-sm text-text-muted mb-8">
            More Episodes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPodcasts.map((ep) => (
              <Link 
                href={`/podcasts/${ep.id}`}
                key={ep.id}
                className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-black/5 group"
              >
                <div className="w-16 h-16 shrink-0 rounded overflow-hidden relative">
                  <img src={ep.imageUrl} alt={ep.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} fill="currentColor" className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                    {ep.author}
                  </span>
                  <h4 className="font-serif font-bold text-[#1a1715] text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    {ep.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
