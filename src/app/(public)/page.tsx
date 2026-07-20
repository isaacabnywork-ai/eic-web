import { HorizontalRow } from "@/components/ui/horizontal-row";
import { BookCarousel } from "@/components/ui/book-carousel";
import { getHomeContentByType, getAllContent } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let sermonsPodcasts = await getHomeContentByType('sermon_podcast');
  if (sermonsPodcasts.length === 0) sermonsPodcasts = await getAllContent('sermon_podcast');

  let podcastsOnly = await getHomeContentByType('podcast');
  if (podcastsOnly.length === 0) podcastsOnly = await getAllContent('podcast');

  let blogSeries = await getHomeContentByType('blog_series');
  if (blogSeries.length === 0) blogSeries = await getAllContent('blog_series');

  // For events, the user requested to see all of them on the home page
  let events = await getAllContent('event');

  let booksReviews = await getHomeContentByType('book_review');
  if (booksReviews.length === 0) booksReviews = await getAllContent('book_review');

  const isEmpty = 
    sermonsPodcasts.length === 0 && 
    podcastsOnly.length === 0 &&
    blogSeries.length === 0 && 
    events.length === 0 && 
    booksReviews.length === 0;

  const sermons = sermonsPodcasts; // All 'sermon_podcast' types are now just Videos
  const podcasts = [...sermonsPodcasts.filter(item => item.audioUrl), ...podcastsOnly];

  return (
    <div className="pb-8 w-full overflow-hidden">
      
      <div className="space-y-24 mt-16 w-full">
        {sermons.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <HorizontalRow 
              title="Videos" 
              items={sermons} 
              aspectRatio="video"
              seeAllUrl="/videos-podcasts"
            />
          </div>
        )}

        {podcasts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <HorizontalRow 
              title="Podcasts" 
              items={podcasts} 
              aspectRatio="video"
              seeAllUrl="/podcasts"
            />
          </div>
        )}

        {blogSeries.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <HorizontalRow 
              title="Blog Series" 
              items={blogSeries} 
              aspectRatio="portrait"
              seeAllUrl="/blog-series"
            />
          </div>
        )}

        {events.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <HorizontalRow 
              title="Upcoming Events" 
              items={events} 
              aspectRatio="square"
              seeAllUrl="/events"
            />
          </div>
        )}

        {booksReviews.length > 0 && (
          <div className="w-full">
            <BookCarousel items={booksReviews} />
          </div>
        )}
        
        {isEmpty && (
          <div className="text-center text-text-muted py-20 max-w-7xl mx-auto px-4 md:px-8">
            <h3 className="text-xl font-serif text-text mb-4">Welcome to 3THIRTY⁺!</h3>
            <p className="mb-4">It looks like your Firebase database is empty.</p>
            <p>You can seed the dummy data by visiting <a href="/api/seed" target="_blank" className="text-accent hover:underline">/api/seed</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
