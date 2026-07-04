import { getAllContent } from "@/lib/db";
import { ContentCard } from "@/components/ui/content-card";

export default async function BlogSeriesPage() {
  const articles = await getAllContent('blog_series');

  return (
    <div className="w-full px-4 md:px-8 py-8 lg:py-24 pt-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-text-main">Blog Series</h1>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6">
        {articles.map((article) => (
          <ContentCard 
            key={article.id} 
            item={article} 
            aspectRatio="portrait"
          />
        ))}
      </div>
      
      {articles.length === 0 && (
        <div className="text-center text-text-muted py-20">
          No articles found.
        </div>
      )}
    </div>
  );
}
