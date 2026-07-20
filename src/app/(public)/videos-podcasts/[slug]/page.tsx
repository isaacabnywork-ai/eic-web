import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/db";
import { VideoPlayButton } from "@/components/ui/video-play-button";
import { SaveButton } from "@/components/ui/save-button";
import { HorizontalRow } from "@/components/ui/horizontal-row";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function VideoPodcastPage({ params }: Props) {
  const resolvedParams = await params;
  const item = await getContentBySlug('sermon_podcast', resolvedParams.slug, 'videos-podcasts');

  if (!item) {
    notFound();
  }

  const allVideos = await getAllContent('sermon_podcast');
  const relatedItems = allVideos
    .filter(v => v.id !== item.id)
    .slice(0, 8);

  // Helper to convert standard youtube links to embed links
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    }
    return url; // Return as is for vimeo or already-embed links
  };

  const embedUrl = item.videoUrl ? getEmbedUrl(item.videoUrl) : '';

  return (
    <div className="pb-24">
      {/* Hero Header / Video Player */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-black">
        {embedUrl ? (
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </>
        )}
      </div>

      {/* Content Body Below Video */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-4">
        {item.isPremium && (
          <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block">
            Premium
          </span>
        )}
        <h1 className="font-serif font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl text-text-main mb-4 leading-tight">
          {item.title}
        </h1>
        <p className="text-lg text-text-muted mb-6">
          by <span className="font-medium text-text-main">{item.author}</span>
        </p>
        
        <div className="flex items-center gap-4 mb-8 border-b border-border-main pb-8">
          <VideoPlayButton item={item} />
          <SaveButton item={item} />
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-12">
        <h2 className="text-2xl font-serif text-text-main mb-4">About this Content</h2>
        <div className="prose prose-lg dark:prose-invert text-text-muted whitespace-pre-wrap mb-16">
          <p>
            {item.description || "No description available for this video or podcast."}
          </p>
        </div>
        
        {/* Related Videos */}
        <HorizontalRow 
          title="Related Videos" 
          items={relatedItems} 
          aspectRatio="video"
        />
      </div>
    </div>
  );
}
