import { getAllContent } from "@/lib/db";
import { EventCard } from "@/components/ui/event-card";

export default async function EventsPage() {
  const events = await getAllContent('event');

  return (
    <div className="w-full px-4 md:px-8 py-8 lg:py-24 pt-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-7xl text-text-main mb-6 leading-tight">Events</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {events.map((event) => (
          <div key={event.id} className="w-full max-w-full">
            <EventCard item={event} />
          </div>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="text-center text-text-muted py-20 border border-border border-dashed rounded-xl">
          <p>No events found.</p>
        </div>
      )}
    </div>
  );
}
