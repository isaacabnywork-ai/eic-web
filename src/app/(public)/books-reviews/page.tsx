import { getAllContent } from "@/lib/db";
import { BooksReviewsGrid } from "@/components/ui/books-reviews-grid";

export default async function BooksReviewsPage() {
  const articles = await getAllContent('book_review');

  return (
    <div className="w-full px-4 md:px-8 py-8 lg:py-24 pt-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-text-main tracking-tight uppercase">
          Book Reviews
        </h1>
      </div>

      <BooksReviewsGrid items={articles} />
    </div>
  );
}
