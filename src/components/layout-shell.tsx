"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Headphones, BookOpen, Calendar, Book, Search, Moon, Sun, User, PlaySquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth-context';
import { MiniAudioPlayer } from './mini-audio-player';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Videos', href: '/videos-podcasts', icon: PlaySquare },
  { label: 'Podcasts', href: '/podcasts', icon: Headphones },
  { label: 'Blogs', href: '/blog-series', icon: BookOpen },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Book Reviews', href: '/books-reviews', icon: Book },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-bg overflow-hidden text-text-main relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 relative w-full">
        {/* Transparent Overlay Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent pt-6 pb-12 px-6 flex items-center justify-between pointer-events-none">
          <div className="flex-1 flex justify-start">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/library" className="w-10 h-10 rounded-full bg-border flex items-center justify-center hover:bg-border/80 transition-colors pointer-events-auto">
                  <User size={20} className="text-text-main" />
                </Link>
                <button onClick={logout} className="text-sm font-medium text-white hover:text-white/80 transition-colors pointer-events-auto">
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors pointer-events-auto">
                <User size={20} className="text-white" />
              </Link>
            )}
          </div>
          
          <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-white pointer-events-auto">3THIRTY⁺</Link>
          
          <div className="flex-1 flex justify-end">
            <button className="pointer-events-auto cursor-pointer p-2 -mr-2">
              <Search size={24} className="text-white" />
            </button>
          </div>
        </header>
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </main>

      <MiniAudioPlayer />

      {/* Floating Dynamic Island Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[500px] md:max-w-[600px]">
        <nav className="bg-bg-elevated/95 backdrop-blur-xl border border-border-main shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-6 py-3 md:py-4 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center transition-all hover:-translate-y-1 ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-main'}`}
                title={item.label}
              >
                <Icon size={22} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Theme Toggle in Nav */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="flex flex-col items-center justify-center transition-all hover:-translate-y-1 text-text-muted hover:text-text-main ml-2"
            title="Toggle Theme"
          >
            <div className="p-2 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
              {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <div className="w-[18px] h-[18px]" />}
            </div>
            <span className="text-[10px] mt-1 font-medium">Theme</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
