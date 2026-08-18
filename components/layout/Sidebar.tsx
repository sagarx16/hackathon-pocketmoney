'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBank } from '@/context/BankContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isParentView, toggleParentView } = useBank();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Accounts', href: '/accounts', icon: 'account_balance' },
    { label: 'Transfers', href: '/transfers', icon: 'swap_horiz' },
    { label: 'Statements', href: '/statements', icon: 'description' },
    { label: 'Cards', href: '/cards', icon: 'credit_card' },
    { label: 'Savings Goals', href: '/savings', icon: 'savings' },
    { label: 'Chores', href: '/chores', icon: 'assignment' },
    { label: 'Guardian Control', href: '/guardian', icon: 'shield_person' },
    { label: 'Profile', href: '/profile', icon: 'person' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center w-full px-6 h-16 bg-[#f7fafd] border-b border-[#c4c6ce]/40 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#000f22] p-1">
            <span className="material-symbols-outlined icon-lg">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
          <span className="font-headline-lg-mobile text-xl font-bold text-[#000f22]">PocketBank</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#0a2540] text-[#57fae9]">
            {isParentView ? 'PARENT MODE' : 'STUDENT'}
          </span>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#000f22]/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#ffffff] border-r border-[#c4c6ce]/40 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col py-6 px-4 gap-2 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-4 pb-6 border-b border-[#c4c6ce]/30 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#0a2540] text-[#57fae9] flex items-center justify-center font-bold shadow-sm">
            <span className="material-symbols-outlined" data-icon="account_balance">account_balance</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-lg font-bold text-[#000f22] leading-tight">PocketBank</h1>
            <p className="font-label-sm text-xs text-[#43474d]">
              {isParentView ? 'Parent Control View' : 'Student Edition'}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#57fae9] text-[#007168] font-bold shadow-xs'
                    : 'text-[#43474d] hover:text-[#000f22] hover:bg-[#e5e8eb]/50'
                }`}
              >
                <span className={`material-symbols-outlined icon-md ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Parent / Student View Switcher */}
        <div className="pt-4 border-t border-[#c4c6ce]/30 mt-auto">
          <button
            onClick={toggleParentView}
            className={`w-full py-3 px-4 rounded-xl border text-xs font-bold font-mono transition-all duration-200 flex items-center justify-center gap-2 ${
              isParentView
                ? 'bg-[#0a2540] text-[#57fae9] border-[#0a2540]'
                : 'border-[#74777e]/40 text-[#000f22] hover:bg-[#f1f4f7]'
            }`}
          >
            <span className="material-symbols-outlined icon-md">
              {isParentView ? 'person' : 'supervisor_account'}
            </span>
            <span>{isParentView ? 'Switch to Student View' : 'Switch to Parent View'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
