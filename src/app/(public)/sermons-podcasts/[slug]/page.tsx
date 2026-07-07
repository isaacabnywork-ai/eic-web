import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/db";
import { SermonPlayButton } from "@/components/ui/sermon-play-button";
import { SaveButton } from "@/components/ui/save-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SermonPodcastPage({ params }: Props) {
  const resolvedParams = await params;
  const sermon = await getContentBySlug('sermon_podcast', resolvedParams.slug, 'sermons-podcasts');

  if (!sermon) {
    notFound();
  }

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={sermon.imageUrl} 
          alt={sermon.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto">
          {sermon.isPremium && (
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block">
              Premium
            </span>
          )}
          <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-text-main mb-4 leading-tight">
            {sermon.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            by <span className="text-white font-medium">{sermon.author}</span>
          </p>
          
          <div className="flex items-center gap-4">
            <SermonPlayButton item={sermon} />
            <SaveButton item={sermon} />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl font-serif text-text-main mb-4">About this Sermon</h2>
        <div className="prose prose-lg dark:prose-invert text-text-muted">
          <p>
            {sermon.description || "No description available for this sermon."}
          </p>
        </div>
      </div>
    </div>
  );
}
