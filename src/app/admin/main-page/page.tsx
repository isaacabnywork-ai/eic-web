"use client";

import React, { useEffect, useState } from "react";
import { getAllContentItems, updateContentItem } from "@/lib/db";
import { ContentItem } from "@/components/ui/content-card";
import { Search, Loader2, Headphones, BookOpen, Calendar, Book, Check } from "lucide-react";

type ContentType = 'sermon_podcast' | 'blog_series' | 'event' | 'book_review';

export default function MainPageCurationPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentType>('sermon_podcast');
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllContentItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to load content items", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleShowOnHome = async (id: string, currentVal: boolean) => {
    setUpdatingId(id);
    const newVal = !currentVal;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showOnHome: newVal } : item))
    );

    try {
      await updateContentItem(id, { showOnHome: newVal });
    } catch (error) {
      console.error("Failed to toggle home page status", error);
      // Revert if failed
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, showOnHome: currentVal } : item))
      );
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter items by type and search query
  const filteredItems = items
    .filter((item) => item.type === activeTab)
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getHomeCount = (type: ContentType) => {
    return items.filter((item) => item.type === type && item.showOnHome).length;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-black">
        <Loader2 className="animate-spin text-[#b47539]" size={36} />
      </div>
    );
  }

  const tabs: { id: ContentType; label: string; icon: React.ElementType }[] = [
    { id: 'sermon_podcast', label: 'Sermons', icon: Headphones },
    { id: 'blog_series', label: 'Blog Posts', icon: BookOpen },
    { id: 'event', label: 'Events', icon: Calendar },
    { id: 'book_review', label: 'Books', icon: Book },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-sans font-black tracking-tighter uppercase text-3xl text-[#1a1715]">
            Main Page Content
          </h1>
          <p className="text-black/60 mt-1">
            Choose which items from each section are displayed on the public homepage.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-px mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const homeCount = getHomeCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2.5 px-5 py-3 border-b-2 font-medium text-sm transition-all focus:outline-none ${
                isActive
                  ? 'border-[#b47539] text-[#b47539]'
                  : 'border-transparent text-black/50 hover:text-black hover:border-black/10'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {homeCount > 0 && (
                <span className="ml-1 bg-[#b47539]/10 text-[#b47539] text-xs px-2 py-0.5 rounded-full font-bold">
                  {homeCount} on Home
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and search */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
          <input
            type="text"
            placeholder={`Search by title or author...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 shadow-sm"
          />
        </div>
      </div>

      {/* Grid List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/5 p-12 text-center text-black/40">
          No items found. Create some content first to select them here!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all shadow-sm ${
                item.showOnHome ? 'border-[#b47539]/30 bg-[#b47539]/[0.01]' : 'border-black/5'
              }`}
            >
              {/* Image thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-black/5 overflow-hidden flex-shrink-0 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-[#1a1715] text-base truncate">
                  {item.title}
                </h4>
                <p className="text-sm text-black/50 truncate">
                  By {item.author}
                </p>
                {item.showOnHome && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b47539] mt-1.5 bg-[#b47539]/5 px-2 py-0.5 rounded-full">
                    <Check size={10} /> Active on Home Page
                  </span>
                )}
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3">
                {updatingId === item.id && (
                  <Loader2 className="animate-spin text-[#b47539]" size={16} />
                )}
                <button
                  onClick={() => handleToggleShowOnHome(item.id, !!item.showOnHome)}
                  disabled={updatingId === item.id}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#b47539] focus:ring-offset-2 ${
                    item.showOnHome ? 'bg-[#b47539]' : 'bg-black/10'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      item.showOnHome ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
