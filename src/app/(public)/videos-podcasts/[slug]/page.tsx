import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/db";
import { VideoPlayButton } from "@/components/ui/video-play-button";
import { SaveButton } from "@/components/ui/save-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function VideoPodcastPage({ params }: Props) {
  const resolvedParams = await params;
  const item = await getContentBySlug('sermon_podcast', resolvedParams.slug, 'videos-podcasts');

  if (!item) {
    notFound();
  }

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
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto">
          {item.isPremium && (
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block">
              Premium
            </span>
          )}
          <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-text-main mb-4 leading-tight">
            {item.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            by <span className="text-white font-medium">{item.author}</span>
          </p>
          
          <div className="flex items-center gap-4">
            <VideoPlayButton item={item} />
            <SaveButton item={item} />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl font-serif text-text-main mb-4">About this Content</h2>
        <div className="prose prose-lg dark:prose-invert text-text-muted whitespace-pre-wrap">
          <p>
            {item.description || "No description available for this video or podcast."}
          </p>
        </div>
      </div>
    </div>
  );
}
