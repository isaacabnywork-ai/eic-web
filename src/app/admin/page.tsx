import { getAllContentItems, getAllContent } from "@/lib/db";
import { ContentTable } from "@/components/admin/content-table";
import { FileText, Headphones, BookOpen, Calendar, Book } from "lucide-react";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const typeFilter = resolvedSearchParams.type as string | undefined;

  let items = [];
  if (typeFilter) {
    items = await getAllContent(typeFilter as any);
  } else {
    items = await getAllContentItems();
  }

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'banner': return 'Banners';
        case 'sermon_podcast': return 'Videos & Podcasts';
        case 'blog_series': return 'Blog Posts';
        case 'event': return 'Events';
        case 'book_review': return 'Books & Reviews';
        default: return 'Dashboard';
      }
    };

  const pageTitle = typeFilter ? getTypeLabel(typeFilter) : 'Dashboard';

  // Calculate stats for Dashboard
  const bannersCount = items.filter(i => i.type === 'banner').length;
  const sermonsCount = items.filter(i => i.type === 'sermon_podcast').length;
  const blogsCount = items.filter(i => i.type === 'blog_series').length;
  const eventsCount = items.filter(i => i.type === 'event').length;
  const booksCount = items.filter(i => i.type === 'book_review').length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      
      {/* Top Bar matching RPM screenshot */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
        <h1 className="font-sans font-black tracking-tighter uppercase text-2xl md:text-3xl text-[#1a1715]">{pageTitle}</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-black/40"></div>
          <span className="text-xs font-medium text-black/60">admin@330plus.com</span>
        </div>
      </div>
      
      {!typeFilter ? (
        // DASHBOARD VIEW
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#1a1715]">{bannersCount}</div>
                <div className="text-xs text-black/40 font-medium uppercase tracking-wider">Banners</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#1a1715]">{sermonsCount}</div>
                <div className="text-xs text-black/40 font-medium uppercase tracking-wider">Videos</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#1a1715]">{blogsCount}</div>
                <div className="text-xs text-black/40 font-medium uppercase tracking-wider">Blog Posts</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#1a1715]">{eventsCount}</div>
                <div className="text-xs text-black/40 font-medium uppercase tracking-wider">Events</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <Book size={20} />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#1a1715]">{booksCount}</div>
                <div className="text-xs text-black/40 font-medium uppercase tracking-wider">Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
            <p className="text-sm text-black/60">
              👋 Welcome to <strong className="text-[#1a1715]">330+ Admin</strong>. Use the sidebar to manage your content. <br/>
              All changes save to Firestore instantly and appear on the <span className="text-[#b47539] font-medium">live site</span> in real-time — no refresh needed.
            </p>
          </div>
        </div>
      ) : (
        // LIST VIEW
        <ContentTable key={typeFilter} initialItems={items} type={pageTitle} contentType={typeFilter} />
      )}

    </div>
  );
}
