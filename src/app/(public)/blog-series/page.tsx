import { getAllContent } from "@/lib/db";
import { BlogFilter } from "@/components/ui/blog-filter";
export const dynamic = 'force-dynamic';

export default async function BlogSeriesPage() {
  const articles = await getAllContent('blog_series');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-24 pt-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-text-main mb-6 leading-tight">Blog Series</h1>
      </div>

      <BlogFilter initialArticles={articles} />
    </div>
  );
}
