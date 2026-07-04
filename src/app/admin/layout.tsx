"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Settings, FileText, ArrowLeft, Loader2, LayoutDashboard, Headphones, BookOpen, Calendar, Book, LogOut, ExternalLink, Sliders } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
      if (user.email && adminEmails.includes(user.email)) {
        setIsAuthorized(true);
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfbf9] text-black">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const NavItem = ({ href, icon: Icon, label, isActive }: { href: string, icon: React.ElementType, label: string, isActive: boolean }) => (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-[#b47539] text-white shadow-md border border-[#b47539]/20' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} className={isActive ? 'text-white' : 'text-white/60'} />
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-[#fdfbf9] text-[#1a1715] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1715] border-r border-black/10 flex flex-col hidden md:flex text-white h-full shadow-2xl z-20">
        <div className="p-6">
          <h2 className="font-serif text-2xl text-white tracking-widest">EIC</h2>
        </div>
        
        <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-bold text-white/30 tracking-widest uppercase mb-3 px-2">Content</h3>
            <nav className="space-y-1">
              <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" isActive={typeof window !== 'undefined' && window.location.pathname === '/admin' && !currentType} />
              <NavItem href="/admin/main-page" icon={Sliders} label="Main Page Content" isActive={typeof window !== 'undefined' && window.location.pathname.includes('/admin/main-page')} />
              <NavItem href="/admin?type=sermon_podcast" icon={Headphones} label="Sermons" isActive={currentType === 'sermon_podcast'} />
              <NavItem href="/admin?type=blog_series" icon={BookOpen} label="Blog Posts" isActive={currentType === 'blog_series'} />
              <NavItem href="/admin?type=event" icon={Calendar} label="Events" isActive={currentType === 'event'} />
              <NavItem href="/admin?type=book_review" icon={Book} label="Books" isActive={currentType === 'book_review'} />
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-white/30 tracking-widest uppercase mb-3 px-2">Account</h3>
            <nav className="space-y-1">
              <NavItem href="/admin/settings" icon={Settings} label="Settings" isActive={false} />
            </nav>
          </div>
        </div>

        <div className="p-4 space-y-2 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <ExternalLink size={16} />
            Preview Site
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#fdfbf9]">
        {children}
      </main>
    </div>
  );
}
