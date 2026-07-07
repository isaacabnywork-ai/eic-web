"use client";

import React, { useState, useMemo } from 'react';
import { ContentItem, ContentCard } from './content-card';

export function BlogFilter({ initialArticles }: { initialArticles: ContentItem[] }) {
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [topic, setTopic] = useState('');
  const [series, setSeries] = useState('');
  const [author, setAuthor] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Extract unique values
  const categories = Array.from(new Set(initialArticles.map(a => a.category).filter(Boolean))) as string[];
  const tags = Array.from(new Set(initialArticles.map(a => a.tag).filter(Boolean))) as string[];
  const topics = Array.from(new Set(initialArticles.map(a => a.topic).filter(Boolean))) as string[];
  const seriesList = Array.from(new Set(initialArticles.map(a => a.series).filter(Boolean))) as string[];
  const authors = Array.from(new Set(initialArticles.map(a => a.author).filter(Boolean))) as string[];

  const resetFilters = () => {
    setCategory('');
    setTag('');
    setTopic('');
    setSeries('');
    setAuthor('');
    setSortBy('newest');
  };

  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    if (category) result = result.filter(a => a.category === category);
    if (tag) result = result.filter(a => a.tag === tag);
    if (topic) result = result.filter(a => a.topic === topic);
    if (series) result = result.filter(a => a.series === series);
    if (author) result = result.filter(a => a.author === author);

    if (sortBy === 'oldest') {
      result.reverse(); // Assuming initial is newest
    } else if (sortBy === 'a-z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [initialArticles, category, tag, topic, series, author, sortBy]);

  const selectClassName = "bg-transparent border border-border-main rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[right_10px_center]";

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className={selectClassName}
        >
          <option value="">Filter by Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select 
          value={tag} 
          onChange={(e) => setTag(e.target.value)}
          className={selectClassName}
        >
          <option value="">Filter by Tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        
        <select 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          className={selectClassName}
        >
          <option value="">Filter by Topics</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select 
          value={series} 
          onChange={(e) => setSeries(e.target.value)}
          className={selectClassName}
        >
          <option value="">Filter by Series</option>
          {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)}
          className={selectClassName}
        >
          <option value="">Filter by Authors</option>
          {authors.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className={selectClassName}
        >
          <option value="newest">Sort by</option>
          <option value="oldest">Oldest</option>
          <option value="a-z">A - Z</option>
          <option value="z-a">Z - A</option>
        </select>

        <button 
          onClick={resetFilters}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6">
        {filteredArticles.map((article) => (
          <ContentCard 
            key={article.id} 
            item={article} 
            aspectRatio="portrait"
          />
        ))}
      </div>
      
      {filteredArticles.length === 0 && (
        <div className="text-center text-text-muted py-20">
          No articles found matching your filters.
        </div>
      )}
    </div>
  );
}
