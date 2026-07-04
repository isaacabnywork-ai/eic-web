"use client"
import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { ContentCard, ContentItem } from '@/components/ui/content-card';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    // In a production app, use Algolia or Typesense for full-text search.
    // For this prototype, we'll fetch all and filter client-side since the dataset is small.
    try {
      const q = query(collection(db, "content"));
      const snapshot = await getDocs(q);
      
      const allItems: ContentItem[] = [];
      snapshot.forEach(doc => allItems.push({ id: doc.id, ...doc.data() } as ContentItem));
      
      const filtered = allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-8 lg:py-24 max-w-[1400px] mx-auto pt-24 min-h-[80vh]">
      <div className="max-w-[600px] mx-auto mb-12">
        <h1 className="text-4xl font-serif text-text-main mb-8 text-center">Search</h1>
        
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            placeholder="Search for sermons, articles, or speakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card-bg border border-border rounded-full py-4 pl-6 pr-12 text-text-main placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 w-10 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors"
          >
            <SearchIcon size={18} />
          </button>
        </form>
      </div>

      {isSearching ? (
        <div className="text-center text-text-muted py-20 animate-pulse">Searching...</div>
      ) : hasSearched ? (
        <>
          <h2 className="text-xl text-text-muted mb-6">
            Found {results.length} result{results.length !== 1 && 's'} for "{searchQuery}"
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => (
              <ContentCard 
                key={item.id} 
                item={item} 
                aspectRatio={item.type === 'blog_series' || item.type === 'book_review' ? 'portrait' : item.type === 'sermon_podcast' ? 'video' : 'square'} 
                className="w-full"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
