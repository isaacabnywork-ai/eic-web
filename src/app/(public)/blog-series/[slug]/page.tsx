import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/db";
import { SaveButton } from "@/components/ui/save-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogSeriesDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const article = await getContentBySlug('blog_series', resolvedParams.slug, 'blog-series');

  if (!article) {
    notFound();
  }

  return (
    <div className="pb-24 pt-24 bg-bg min-h-screen">
      {/* Reading Layout Header */}
      <div className="max-w-[700px] mx-auto px-4 md:px-8 mb-12 text-center">
        {article.isPremium && (
          <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-6 inline-block">
            Premium
          </span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-main mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-text-muted mt-8">
          <p className="text-lg">
            By <span className="text-text-main font-medium">{article.author}</span>
          </p>
          <div className="h-4 w-px bg-border"></div>
          <SaveButton item={article} />
        </div>
      </div>

      {/* Feature Image */}
      {article.imageUrl && (
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 mb-16">
          <div className="relative w-full aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="max-w-[700px] mx-auto px-4 md:px-8">
        <article className="prose prose-lg md:prose-xl dark:prose-invert prose-p:font-serif prose-p:leading-relaxed text-text-main">
          {/* For now we just render description or body_text. In a real app we'd render HTML/Markdown */}
          <p>
            {article.description || "No content available for this article yet."}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. 
          </p>
          <p>
            Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor.
          </p>
        </article>
      </div>
    </div>
  );
}
