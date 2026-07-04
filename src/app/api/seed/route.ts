import { NextResponse } from 'next/server';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

const DUMMY_DATA = [
  {
    id: "sp-1",
    title: "The Supremacy of Christ",
    type: "sermon_podcast",
    author: "Pastor John Doe",
    imageUrl: "https://images.unsplash.com/photo-1782127807629-022bd7ecede3?q=80&w=2370&auto=format&fit=crop",
    url: "/sermons-podcasts/supremacy-of-christ",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "sp-2",
    title: "Understanding Genesis",
    type: "sermon_podcast",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1781322675144-d58ef28760ae?q=80&w=2050&auto=format&fit=crop",
    url: "/sermons-podcasts/understanding-genesis",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "sp-3",
    title: "Hard to Reach: North Korea",
    type: "sermon_podcast",
    author: "Steven Morales",
    description: "In this Hard to Reach video series, Steven Morales takes us to the Korean Peninsula, where megachurches and labor camps exist just miles from each other.",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=2000&h=1000",
    url: "/sermons-podcasts/hard-to-reach",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "sp-4",
    title: "Inside the Persecuted Church",
    type: "sermon_podcast",
    author: "Steven Morales",
    description: "Steven Morales talks with Eric Foley about missionary work in the restricted areas.",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/sermons-podcasts/inside-persecuted-church",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "bs-1",
    title: "Navigating Faith in a Modern World",
    type: "blog_series",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1782605626069-a4007aee78a1?q=80&w=2370&auto=format&fit=crop",
    url: "/blog-series/navigating-faith",
    isPremium: true,
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "bs-2",
    title: "The Beatitudes Explained",
    type: "blog_series",
    author: "David Lee",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/blog-series/beatitudes",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "ev-1",
    title: "Summer Youth Camp 2026",
    type: "event",
    author: "EIC Ministry",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/events/summer-camp",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "ev-2",
    title: "Leadership Summit",
    type: "event",
    author: "EIC Ministry",
    imageUrl: "https://images.unsplash.com/photo-1782458839518-f054438c3866?q=80&w=2675&auto=format&fit=crop",
    url: "/events/leadership-summit",
    isFeatured: false,
    showOnHome: true
  },
  {
    id: "br-1",
    title: "Review: Knowing God by J.I. Packer",
    type: "book_review",
    author: "John Doe",
    imageUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/books-reviews/knowing-god",
    isFeatured: true,
    showOnHome: true
  },
  {
    id: "br-2",
    title: "Review: Mere Christianity",
    type: "book_review",
    author: "Jane Smith",
    imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=600&h=400",
    url: "/books-reviews/mere-christianity",
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
