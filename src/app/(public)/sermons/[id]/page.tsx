import { getContentById, getAllContent } from "@/lib/db";
import { SermonGrid } from "@/components/ui/sermon-grid";
import { notFound } from "next/navigation";

function getYoutubeEmbedUrl(url: string) {
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const parts = url.split("?");
    if (parts.length > 1) {
      videoId = new URLSearchParams(parts[1]).get("v") || "";
    }
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default async function SermonSinglePage({ params }: { params: { id: string } }) {
  const sermon = await getContentById(params.id);
  
  if (!sermon || !sermon.videoUrl) {
    notFound();
  }

  // Fetch related sermons (for now, just getting all and excluding the current one)
  const allContent = await getAllContent('sermon_podcast');
  const relatedSermons = allContent
    .filter(item => item.videoUrl && item.id !== sermon.id)
    .slice(0, 6); // Just take up to 6 for the "Related" section

  return (
    <div className="w-full bg-[#1a1715] min-h-screen pt-20">
      
      {/* Video Banner */}
      <div className="w-full aspect-video md:aspect-[21/9] max-h-[70vh] bg-black">
        <iframe 
          src={getYoutubeEmbedUrl(sermon.videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-3">
            {sermon.author}
          </p>
          <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-white mb-6 leading-tight">
            {sermon.title}
          </h1>
          <div className="w-16 h-1 bg-white/20 mb-8"></div>
          
          <div className="text-white/80 text-lg leading-relaxed whitespace-pre-line">
            {sermon.description || "No description provided for this sermon."}
          </div>
        </div>
      </div>

      {/* Related Sermons */}
      {relatedSermons.length > 0 && (
        <div className="w-full border-t border-white/10 bg-black/20">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
            <SermonGrid items={relatedSermons} hideHeader={false} />
          </div>
        </div>
      )}

    </div>
  );
}
