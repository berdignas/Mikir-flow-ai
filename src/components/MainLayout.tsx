'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LeftSidebar from '@/components/LeftSidebar';
import Navbar from '@/components/Navbar';
import { useAuthContext } from '@/context/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthLoaded } = useAuthContext();
  const isLoginPage = pathname === '/login';

  // Auth Protection Guard: If not logged in & not on login page, redirect to /login
  useEffect(() => {
    if (isAuthLoaded && !currentUser && !isLoginPage) {
      router.push('/login');
    }
  }, [currentUser, isAuthLoaded, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-[#F8F9FA]">
        {children}
      </main>
    );
  }

  // Show loading spinner while checking auth session state
  if (!isAuthLoaded || (!currentUser && !isLoginPage)) {
    return (
      <div className="h-screen w-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-[#FF6B4D] rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-gray-500">Mengarahkan ke Halaman Login...</p>
      </div>
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
