"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentItem } from "@/components/ui/content-card";
import { addContentItem, updateContentItem } from "@/lib/db";
import { ImageUploader } from "@/components/admin/image-uploader";

export function EditorForm({ initialData }: { initialData: ContentItem | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "sermon_podcast",
    author: initialData?.author || "",
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
    audioUrl: initialData?.audioUrl || "",
    videoUrl: initialData?.videoUrl || "",
    isFeatured: initialData?.isFeatured || false,
    isPremium: initialData?.isPremium || false,
    showOnHome: initialData?.showOnHome || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Auto-generate URL based on type and title slug
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const urlBase = formData.type.replace('_', '-');
      // For routing we used sermons-podcasts, blog-series, books-reviews. 
      // We mapped types: sermon_podcast -> sermons-podcasts, blog_series -> blog-series
      let routeName = urlBase;
      if (formData.type === 'sermon_podcast') routeName = 'sermons-podcasts';
      if (formData.type === 'book_review') routeName = 'books-reviews';
      if (formData.type === 'event') routeName = 'events';

      const finalUrl = `/${routeName}/${slug}`;

      const itemData = {
        title: formData.title,
        type: formData.type as ContentItem['type'],
        author: formData.author,
        imageUrl: formData.imageUrl,
        url: finalUrl,
        description: formData.description,
        audioUrl: formData.audioUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        isFeatured: formData.isFeatured,
        isPremium: formData.isPremium,
        showOnHome: formData.showOnHome,
      };

      if (initialData?.id) {
        await updateContentItem(initialData.id, itemData);
      } else {
        await addContentItem(itemData);
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Error saving content", error);
      alert("Failed to save content. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Title</label>
          <input 
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 shadow-sm"
            placeholder="e.g., The Power of Faith"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Type</label>
          <select 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] shadow-sm"
          >
            <option value="sermon_podcast">Sermon & Podcast</option>
            <option value="blog_series">Blog Series</option>
            <option value="event">Event</option>
            <option value="book_review">Book Review</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Author / Speaker</label>
          <input 
            type="text"
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 shadow-sm"
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Cover Image</label>
          <ImageUploader 
            defaultImage={formData.imageUrl} 
            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#1a1715]">Description (Optional)</label>
        <textarea 
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 resize-none shadow-sm"
          placeholder="Brief summary or description of the content..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Audio URL (Optional)</label>
          <input 
            type="url"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 shadow-sm"
            placeholder="Direct link to .mp3 file"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1a1715]">Video URL (Optional)</label>
          <input 
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b47539] focus:ring-1 focus:ring-[#b47539] text-[#1a1715] placeholder:text-black/30 shadow-sm"
            placeholder="YouTube or Vimeo link"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-black/5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-5 h-5 rounded border-black/20 text-[#b47539] focus:ring-[#b47539] accent-[#b47539] bg-white cursor-pointer"
          />
          <span className="text-sm font-medium text-[#1a1715] group-hover:text-[#b47539] transition-colors">Feature on Home Banner</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox"
            name="showOnHome"
            checked={formData.showOnHome}
            onChange={handleChange}
            className="w-5 h-5 rounded border-black/20 text-[#b47539] focus:ring-[#b47539] accent-[#b47539] bg-white cursor-pointer"
          />
          <span className="text-sm font-medium text-[#1a1715] group-hover:text-[#b47539] transition-colors">Show on Home Page Rows</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox"
            name="isPremium"
            checked={formData.isPremium}
            onChange={handleChange}
            className="w-5 h-5 rounded border-black/20 text-[#b47539] focus:ring-[#b47539] accent-[#b47539] bg-white cursor-pointer"
          />
          <span className="text-sm font-medium text-[#1a1715] group-hover:text-[#b47539] transition-colors">Premium Content</span>
        </label>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1a1715] hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSubmitting ? "Saving..." : "Save Content"}
        </button>
      </div>
    </form>
  );
}
