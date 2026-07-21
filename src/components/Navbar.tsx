'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthContext, UserRole } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Code, Eye, LogOut, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthContext();
  
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role Color Classification (Design System compliant: PM = Orange, Developer = Blue, Client = Green)
  const roleStyles: Record<UserRole, { label: string; badge: string; avatar: string; iconColor: string; icon: any }> = {
    pm: { 
      label: 'Project Manager', 
      badge: 'bg-[#FFEDD5] text-[#EA580C] border-orange-200/80', 
      avatar: 'bg-gradient-to-tr from-[#FF6B4D] to-amber-500 text-white',
      iconColor: 'text-[#EA580C]',
      icon: ShieldCheck 
    },
    developer: { 
      label: 'Developer', 
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80', 
      avatar: 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white',
      iconColor: 'text-blue-600',
      icon: Code 
    },
    client: { 
      label: 'Client', 
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', 
      avatar: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white',
      iconColor: 'text-emerald-600',
      icon: Eye 
    },
  };

  const currentRole = currentUser?.role || 'pm';
  const activeStyle = roleStyles[currentRole];
  const IconComp = activeStyle.icon;

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 shrink-0 relative z-40 shadow-2xs font-sans">
      
      {/* Workflow Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Link href="/prd" className={`px-2.5 py-1 rounded-md transition-colors ${pathname === '/prd' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-700'}`}>
          1. PRD Spec
        </Link>
        <span className="text-gray-300">→</span>
        <Link href="/" className={`px-2.5 py-1 rounded-md transition-colors ${pathname === '/' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-700'}`}>
          2. Flow Diagram
        </Link>
        <span className="text-gray-300">→</span>
        <Link href="/task" className={`px-2.5 py-1 rounded-md transition-colors ${pathname === '/task' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-700'}`}>
          3. Developer Task
        </Link>
      </div>

      {/* User Profile Card Button */}
      <div className="relative z-50" ref={dropdownRef}>
        {currentUser ? (
          <button
            type="button"
            onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}
            className="flex items-center gap-3 bg-white border border-[#E5E7EB] hover:border-[#FF6B4D] rounded-xl px-3 py-1.5 transition-all shadow-2xs cursor-pointer group"
          >
            <div className={`h-8 w-8 rounded-xl ${activeStyle.avatar} font-bold text-xs flex items-center justify-center shadow-2xs`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#0A0A0A] leading-tight flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <IconComp className={`w-3.5 h-3.5 ${activeStyle.iconColor} shrink-0`} />
              </div>
              <div className="text-[10px] font-semibold tracking-wide">
                <span className={`inline-block px-1.5 py-0.2 rounded border ${activeStyle.badge}`}>
                  {activeStyle.label}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform duration-200 ${isOpenUserMenu ? 'rotate-180 text-[#FF6B4D]' : ''}`} />
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 bg-[#FF6B4D] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs hover:brightness-110 transition-colors"
          >
            <User className="w-3.5 h-3.5" /> Login
          </Link>
        )}

        {/* Dropdown Card Popover: Highest Z-Index (z-[100]) */}
        {isOpenUserMenu && currentUser && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_15px_35px_rgba(0,0,0,0.12)] p-3.5 z-[100] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* Active User Info Header */}
            <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${activeStyle.avatar} font-bold text-sm flex items-center justify-center shadow-2xs shrink-0`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#0A0A0A] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-[#6B7280] truncate">{currentUser.email}</p>
                </div>
              </div>

              {/* Role Badge (Color Classified) */}
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-[#6B7280] font-medium text-[11px]">Role / Peran:</span>
                <span className={`font-semibold px-2.5 py-0.5 rounded-lg border text-xs flex items-center gap-1.5 ${activeStyle.badge}`}>
                  <IconComp className="w-3.5 h-3.5" />
                  {activeStyle.label}
                </span>
              </div>
            </div>

            {/* Logout Button Only */}
            <div className="border-t border-gray-100 pt-1">
              <Link
                href="/login"
                onClick={() => {
                  logout();
                  setIsOpenUserMenu(false);
                }}
                className="flex items-center justify-center gap-2 w-full p-2.5 text-xs font-bold text-red-600 bg-red-50/60 hover:bg-red-50 rounded-xl border border-red-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar / Logout</span>
              </Link>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
