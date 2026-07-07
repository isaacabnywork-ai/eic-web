import { notFound } from "next/navigation";
import { getContentById } from "@/lib/db";
import { Calendar, Wallet, Users } from "lucide-react";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Use getContentById to guarantee we find the event regardless of its url property
  const event = await getContentById(slug);
  
  if (!event || event.type !== 'event') {
    notFound();
  }

  const isExpired = true; // Hardcode for now, or calculate based on date string

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 lg:py-24 pt-24">
      {/* Title */}
      <h1 className="font-serif font-bold text-3xl md:text-5xl text-text-main mb-8">
        {event.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Description & Flyer */}
        <div className="lg:col-span-2 space-y-8">
          {event.imageUrl && (
            <div className="w-full rounded-xl overflow-hidden shadow-sm">
              <img src={event.imageUrl} alt={event.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none text-text-main/80 font-sans leading-relaxed whitespace-pre-wrap">
            {event.description ? (
              <p>{event.description}</p>
            ) : (
              // Mock description if not provided in DB
              <div className="space-y-4">
                <p>No description provided for this event.</p>
              </div>
            )}
          </div>

          {/* Add to Calendar Box */}
          <div className="border border-border-main rounded-xl p-6 flex items-center justify-center sm:justify-end bg-bg-elevated mt-12">
            <button className="border border-border-main px-6 py-2 rounded text-text-main hover:bg-border transition-colors font-medium text-sm">
              + Add to Google Calendar
            </button>
          </div>
        </div>

        {/* Right Column: Metadata & Share */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Info Box */}
          <div className="border border-border-main rounded-xl p-8 bg-bg-elevated space-y-8">
            {/* Date */}
            <div className="flex items-start gap-4">
              <Calendar className="text-text-muted mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-text-main text-sm tracking-widest uppercase mb-1">Date</h3>
                <p className="text-text-muted">{event.date || 'TBD'}</p>
                {isExpired && <p className="text-red-500 text-sm mt-1 font-medium">Past Event</p>}
              </div>
            </div>

            {/* Cost */}
            <div className="flex items-start gap-4">
              <Wallet className="text-text-muted mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-text-main text-sm tracking-widest uppercase mb-1">Cost</h3>
                <p className="text-text-muted">{event.cost || 'Free'}</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-start gap-4">
              <Users className="text-text-muted mt-1 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-text-main text-sm tracking-widest uppercase mb-1">Organizer</h3>
                <p className="text-text-muted mb-4">{event.organizer || 'EIC'}</p>
                
                {/* Organizer Socials */}
                <div className="flex gap-2">
                  <a href="#" className="w-8 h-8 flex items-center justify-center border border-border-main rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center border border-border-main rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 flex items-center justify-center border border-border-main rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Share Box */}
          <div className="border border-border-main rounded-xl p-8 bg-bg-elevated text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-main"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-bg-elevated px-4 text-xs font-bold tracking-widest uppercase text-text-main">
                  Share This Event
                </span>
              </div>
            </div>
            
            <div className="flex justify-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center bg-[#3b5998] text-white rounded hover:opacity-90 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white dark:text-black text-white rounded hover:opacity-90 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded hover:opacity-90 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#ea4335] text-white rounded hover:opacity-90 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
