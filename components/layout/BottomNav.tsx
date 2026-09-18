'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav: React.FC<{ onOpenMenu?: () => void }> = ({ onOpenMenu }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/home', icon: 'home' },
    { label: 'Transfers', href: '/transfers', icon: 'swap_horiz' },
    { label: 'Cards', href: '/cards', icon: 'credit_card' },
    { label: 'Savings', href: '/savings', icon: 'savings' },
    { label: 'Chores', href: '/chores', icon: 'assignment' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 no-underline min-w-[56px] ${
                isActive
                  ? 'text-[#007168]'
                  : 'text-[#74777e] hover:text-[#000f22]'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#57fae9] shadow-2xs' : 'bg-transparent'
              }`}>
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 font-medium ${isActive ? 'font-bold text-[#007168]' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
