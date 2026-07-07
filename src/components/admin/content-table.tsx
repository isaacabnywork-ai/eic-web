"use client";

import React, { useState } from "react";
import { ContentItem } from "@/components/ui/content-card";
import { deleteContentItem, addContentItem } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export function ContentTable({ initialItems, type, contentType }: { initialItems: ContentItem[], type: string, contentType: string }) {
  const [items, setItems] = useState(initialItems);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      setIsProcessing(id);
      try {
        await deleteContentItem(id);
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete content.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const handleDuplicate = async (item: ContentItem) => {
    if (confirm(`Are you sure you want to duplicate "${item.title}"?`)) {
      setIsProcessing(item.id + '-dup');
      try {
        const { id, ...itemData } = item;
        const newItemData = {
          ...itemData,
          title: `${item.title} (Copy)`,
          url: `${item.url}-copy-${Date.now()}`
        };
        const newId = await addContentItem(newItemData);
        setItems([{ id: newId, ...newItemData } as ContentItem, ...items]);
      } catch (error) {
        console.error("Failed to duplicate", error);
        alert("Failed to duplicate content.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const getAddButtonText = () => {
    if (type.includes('Sermon')) return '+ Add Sermon';
    if (type.includes('Blog')) return '+ Add Post';
    if (type.includes('Event')) return '+ Add Event';
    if (type.includes('Book')) return '+ Add Book';
    return '+ Add New';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl text-[#1a1715]">{type}</h3>
        <Link 
          href={`/admin/editor?type=${contentType}`} 
          className="bg-[#1a1715] hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          {getAddButtonText()}
        </Link>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex items-center justify-between hover:border-black/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/5 flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/20 font-serif text-xs">No Img</div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-[#1a1715] text-[15px]">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-white bg-[#b47539] px-2 py-0.5 rounded-full">{item.type.replace('_', ' ').toUpperCase()}</span>
                  <span className="text-xs text-black/40">· {item.author || 'EIC Admin'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleDuplicate(item)}
                disabled={isProcessing === item.id + '-dup'}
                className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
              >
                {isProcessing === item.id + '-dup' ? 'Duplicating...' : 'Duplicate'}
              </button>
              <Link 
                href={`/admin/editor?id=${item.id}`}
                className="px-4 py-1.5 bg-black/5 text-[#1a1715] hover:bg-black/10 rounded-full text-xs font-medium transition-colors"
              >
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={isProcessing === item.id}
                className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
              >
                {isProcessing === item.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-white p-12 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <Plus className="text-black/40" />
            </div>
            <h4 className="font-medium text-[#1a1715]">No {type} yet</h4>
            <p className="text-sm text-black/40 mt-1 mb-4">Get started by creating your first piece of content.</p>
            <Link 
              href={`/admin/editor?type=${contentType}`} 
              className="text-[#b47539] text-sm font-medium hover:underline"
            >
              {getAddButtonText()}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
