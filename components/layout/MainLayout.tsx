'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../ui/ToastContainer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/landing' || pathname === '/';

  if (isLoginPage || isLandingPage) {
    return (
      <div className="min-h-screen">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafd] text-[#181c1e] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">{children}</main>
      </div>
      <BottomNav />
      <ToastContainer />
    </div>
  );
};
