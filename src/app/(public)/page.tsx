import { HorizontalRow } from "@/components/ui/horizontal-row";
import { BookCarousel } from "@/components/ui/book-carousel";
import { getHomeContentByType, getAllContent } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let sermonsPodcasts = await getHomeContentByType('sermon_podcast');
  let blogSeries = await getHomeContentByType('blog_series');
  let events = await getHomeContentByType('event');
  let booksReviews = await getHomeContentByType('book_review');

  const isCurationEmpty = 
    sermonsPodcasts.length === 0 && 
    blogSeries.length === 0 && 
    events.length === 0 && 
    booksReviews.length === 0;

  if (isCurationEmpty) {
    sermonsPodcasts = await getAllContent('sermon_podcast');
    blogSeries = await getAllContent('blog_series');
    events = await getAllContent('event');
    booksReviews = await getAllContent('book_review');
  }

  const isEmpty = 
    sermonsPodcasts.length === 0 && 
    blogSeries.length === 0 && 
    events.length === 0 && 
    booksReviews.length === 0;

  const sermons = sermonsPodcasts.filter(item => item.videoUrl);
  const podcasts = sermonsPodcasts.filter(item => item.audioUrl);

  return (
    <div className="pb-8">
      
      <div className="px-4 md:px-8 space-y-12 mt-12">
        {sermons.length > 0 && (
          <HorizontalRow 
            title="Videos" 
            items={sermons} 
            aspectRatio="video"
            seeAllUrl="/videos-podcasts"
          />
        )}

        {podcasts.length > 0 && (
          <HorizontalRow 
            title="Podcasts" 
            items={podcasts} 
            aspectRatio="square"
            seeAllUrl="/videos-podcasts"
          />
        )}

        {blogSeries.length > 0 && (
          <HorizontalRow 
            title="Blog Series" 
            items={blogSeries} 
            aspectRatio="portrait"
            seeAllUrl="/blog-series"
          />
        )}

        {events.length > 0 && (
          <HorizontalRow 
            title="Upcoming Events" 
            items={events} 
            aspectRatio="square"
            seeAllUrl="/events"
          />
        )}

        {booksReviews.length > 0 && (
          <div className="w-full">
            <BookCarousel items={booksReviews} />
          </div>
        )}
        
        {isEmpty && (
          <div className="text-center text-text-muted py-20">
            <h3 className="text-xl font-serif text-text mb-4">Welcome to 330+!</h3>
            <p className="mb-4">It looks like your Firebase database is empty.</p>
            <p>You can seed the dummy data by visiting <a href="/api/seed" target="_blank" className="text-accent hover:underline">/api/seed</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
