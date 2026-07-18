import { NextResponse } from 'next/server';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

const DUMMY_DATA = [
  {
    id: "sp-1",
    title: "The Basics of Web Dev",
    type: "sermon_podcast",
    author: "Jane Doe",
    imageUrl: "https://images.unsplash.com/photo-1782127807629-022bd7ecede3?q=80&w=2370&auto=format&fit=crop",
    url: "/videos-podcasts/basics-web-dev",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "sp-2",
    title: "Understanding React",
    type: "sermon_podcast",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1781322675144-d58ef28760ae?q=80&w=2050&auto=format&fit=crop",
    url: "/videos-podcasts/understanding-react",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "sp-3",
    title: "Hard to Reach: Remote Work",
    type: "sermon_podcast",
    author: "Steven Morales",
    description: "In this series, we explore the challenges of remote work and building connected teams across the globe.",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=2000&h=1000",
    url: "/videos-podcasts/hard-to-reach",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "sp-4",
    title: "Inside Silicon Valley",
    type: "sermon_podcast",
    author: "Steven Morales",
    description: "Steven talks with startup founders about the reality of building a business from scratch.",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/videos-podcasts/inside-silicon-valley",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "bs-1",
    title: "Navigating Tech in a Modern World",
    type: "blog_series",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1782605626069-a4007aee78a1?q=80&w=2370&auto=format&fit=crop",
    url: "/blog-series/navigating-tech",
    isPremium: true,
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "bs-2",
    title: "The Next.js Router Explained",
    type: "blog_series",
    author: "David Lee",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/blog-series/nextjs-router",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "ev-1",
    title: "Summer Developer Camp 2026",
    type: "event",
    author: "330+ Community",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/events/summer-camp",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "ev-2",
    title: "Tech Leadership Summit",
    type: "event",
    author: "330+ Community",
    imageUrl: "https://images.unsplash.com/photo-1782458839518-f054438c3866?q=80&w=2675&auto=format&fit=crop",
    url: "/events/tech-summit",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "br-1",
    title: "Review: Clean Code",
    type: "book_review",
    author: "John Doe",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/books-reviews/clean-code",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "br-2",
    title: "Review: Pragmatic Programmer",
    type: "book_review",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/books-reviews/pragmatic-programmer",
    isFeatured: false,
    showOnHome: true
  }
];

export async function GET() {
  try {
    const contentRef = collection(db, "content");
    
    let count = 0;
    for (const item of DUMMY_DATA) {
      await setDoc(doc(contentRef, item.id), item);
      count++;
    }

    return NextResponse.json({ success: true, message: `Successfully seeded ${count} items to Firestore!` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
