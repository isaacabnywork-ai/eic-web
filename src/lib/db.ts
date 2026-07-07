import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { ContentItem } from "@/components/ui/content-card";

export async function getFeaturedContent(): Promise<ContentItem[]> {
  const q = query(collection(db, "content"), where("type", "==", "banner"));
  const querySnapshot = await getDocs(q);
  
  const items: ContentItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as ContentItem);
  });
  
  return items;
}

export async function getContentByType(type: 'sermon_podcast' | 'blog_series' | 'event' | 'book_review' | 'banner'): Promise<ContentItem[]> {
  const q = query(
    collection(db, "content"), 
    where("type", "==", type),
    where("isFeatured", "==", false)
  );
  const querySnapshot = await getDocs(q);
  
  const items: ContentItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as ContentItem);
  });
  
  return items;
}

export async function getHomeContentByType(type: 'sermon_podcast' | 'blog_series' | 'event' | 'book_review' | 'banner'): Promise<ContentItem[]> {
  const q = query(
    collection(db, "content"), 
    where("type", "==", type),
    where("showOnHome", "==", true)
  );
  const querySnapshot = await getDocs(q);
  
  const items: ContentItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as ContentItem);
  });
  
  return items;
}

export async function getAllContent(type: 'sermon_podcast' | 'blog_series' | 'event' | 'book_review' | 'banner'): Promise<ContentItem[]> {
  const q = query(
    collection(db, "content"), 
    where("type", "==", type)
  );
  const querySnapshot = await getDocs(q);
  
  const items: ContentItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as ContentItem);
  });
  
  return items;
}

export async function getAllContentItems(): Promise<ContentItem[]> {
  const { collection, getDocs } = await import("firebase/firestore");
  const querySnapshot = await getDocs(collection(db, "content"));
  
  const items: ContentItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as ContentItem);
  });
  
  return items;
}

export async function getContentBySlug(type: 'sermon_podcast' | 'blog_series' | 'event' | 'book_review' | 'banner', slug: string, routePrefix?: string): Promise<ContentItem | null> {
  const urlToMatch = routePrefix ? `/${routePrefix}/${slug}` : `/${type}s/${slug}`;
  const q = query(
    collection(db, "content"), 
    where("url", "==", urlToMatch)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as ContentItem;
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const { doc, getDoc } = await import("firebase/firestore");
  const docRef = doc(db, "content", id);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as ContentItem;
  }
  return null;
}

export async function toggleBookmark(userId: string, item: ContentItem) {
  const { doc, setDoc, deleteDoc, getDoc } = await import("firebase/firestore");
  const bookmarkRef = doc(db, "users", userId, "bookmarks", item.id);
  const snap = await getDoc(bookmarkRef);
  
  if (snap.exists()) {
    await deleteDoc(bookmarkRef);
    return false; // unbookmarked
  } else {
    await setDoc(bookmarkRef, item);
    return true; // bookmarked
  }
}

export async function checkIsBookmarked(userId: string, itemId: string) {
  const { doc, getDoc } = await import("firebase/firestore");
  const bookmarkRef = doc(db, "users", userId, "bookmarks", itemId);
  const snap = await getDoc(bookmarkRef);
  return snap.exists();
}

export async function getUserBookmarks(userId: string): Promise<ContentItem[]> {
  const { collection, getDocs } = await import("firebase/firestore");
  const bookmarksRef = collection(db, "users", userId, "bookmarks");
  const snapshot = await getDocs(bookmarksRef);
  
  const items: ContentItem[] = [];
  snapshot.forEach((doc) => {
    items.push(doc.data() as ContentItem);
  });
  
  return items;
}

export async function addContentItem(item: Omit<ContentItem, "id">): Promise<string> {
  const { collection, addDoc } = await import("firebase/firestore");
  const docRef = await addDoc(collection(db, "content"), item);
  return docRef.id;
}

export async function updateContentItem(id: string, updates: Partial<ContentItem>): Promise<void> {
  const { doc, updateDoc } = await import("firebase/firestore");
  const docRef = doc(db, "content", id);
  await updateDoc(docRef, updates);
}

export async function deleteContentItem(id: string): Promise<void> {
  const { doc, deleteDoc } = await import("firebase/firestore");
  const docRef = doc(db, "content", id);
  await deleteDoc(docRef);
}
