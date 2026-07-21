'use client';

import { usePathname } from 'next/navigation';
import LeftSidebar from '@/components/LeftSidebar';
import Navbar from '@/components/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-[#F8F9FA]">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background-canvas)] font-sans">
      <LeftSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Navbar />
        <main className="relative flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
