import React from 'react';
import Link from 'next/link';

export function AuthorCircle({ author, imageUrl, url }: { author: string; imageUrl: string; url: string }) {
  return (
    <Link href={url} className="flex flex-col items-center gap-2 group flex-shrink-0 snap-start">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-colors bg-card-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={author} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-sm font-medium text-text-main group-hover:text-accent transition-colors">
        {author}
      </span>
    </Link>
  );
}
