"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, Home, Headphones, BookOpen, Calendar, Book, PlaySquare, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIDEBAR_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { 
    label: 'Videos', 
    icon: PlaySquare, 
    href: '/videos-podcasts',
    subItems: [
      { label: 'Latest Sermons', href: '/videos-podcasts' },
      { label: 'Featured Series', href: '/videos-podcasts?filter=featured' },
    ]
  },
  { 
    label: 'Podcasts', 
    icon: Headphones, 
    href: '/podcasts',
    subItems: [
      { label: 'All Episodes', href: '/podcasts' },
      { label: 'Interviews', href: '/podcasts?filter=interviews' },
    ]
  },
  { 
    label: 'Blogs', 
    icon: BookOpen, 
    href: '/blog-series',
    subItems: [
      { label: 'Latest Articles', href: '/blog-series' },
      { label: 'Premium Content', href: '/blog-series?premium=true' },
    ]
  },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Book Reviews', href: '/books-reviews', icon: Book },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[300px] max-w-[80vw] bg-bg-elevated border-r border-border-main shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-main sticky top-0 bg-bg-elevated/90 backdrop-blur-md z-10">
          <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-text-main" onClick={onClose}>
            3THIRTY⁺
          </Link>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-main"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const hasSubItems = link.subItems && link.subItems.length > 0;
            const isDropdownOpen = openDropdowns[link.label];
            const Icon = link.icon;

            return (
              <div key={link.label} className="mb-2">
                {hasSubItems ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isActive || isDropdownOpen ? 'bg-accent/10 text-accent font-semibold' : 'text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={isActive || isDropdownOpen ? 'text-accent' : 'text-text-muted'} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-accent' : 'text-text-muted'}`} 
                      />
                    </button>
                    
                    {/* Submenu Accordion */}
                    <div 
                      className={`grid transition-all duration-200 ease-in-out ${isDropdownOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden flex flex-col gap-1 pl-11 pr-2">
                        {link.subItems.map(subItem => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={onClose}
                            className="group flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <span>{subItem.label}</span>
                            <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-semibold' : 'text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    <Icon size={20} className={isActive ? 'text-accent' : 'text-text-muted'} />
                    <span>{link.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-border-main mt-auto">
          <p className="text-xs text-text-muted text-center font-medium">
            © {new Date().getFullYear()} 3THIRTY⁺
          </p>
        </div>
      </aside>
    </>
  );
}
