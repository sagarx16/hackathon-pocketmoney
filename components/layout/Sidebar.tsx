'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBank } from '@/context/BankContext';
import { UserButton, Show, useClerk } from '@clerk/nextjs';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isParentView, toggleParentView, userProfile, logout } = useBank();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/home', icon: 'home' },
    { label: 'Accounts', href: '/accounts', icon: 'account_balance' },
    { label: 'Transfers', href: '/transfers', icon: 'swap_horiz' },
    { label: 'Statements', href: '/statements', icon: 'description' },
    { label: 'Cards', href: '/cards', icon: 'credit_card' },
    { label: 'Savings Goals', href: '/savings', icon: 'savings' },
    { label: 'Chores', href: '/chores', icon: 'assignment' },
    { label: 'Guardian Control', href: '/guardian', icon: 'shield_person' },
    { label: 'Profile', href: '/profile', icon: 'person' },
  ];

  const { signOut } = useClerk();

  const handleLogout = async () => {
    setMobileOpen(false);
    logout();
    await signOut({ redirectUrl: '/' });
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center w-full px-4 sm:px-6 h-16 bg-[#f7fafd]/95 backdrop-blur-md border-b border-[#c4c6ce]/40 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#000f22] p-1.5 -ml-1.5 rounded-lg hover:bg-black/5 active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined icon-lg text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
          <Link href="/home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 rounded-xl bg-white border border-[#c4c6ce]/40 p-1 flex items-center justify-center shadow-xs overflow-hidden">
              <img src="/logo.png" alt="PocketBank Logo" className="w-7 h-7 object-contain shrink-0" />
            </div>
            <span className="font-black text-xl sm:text-2xl text-[#0a2540] tracking-tight">
              Pocket<span className="text-[#0d9488]">Bank</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleParentView}
            className="text-[10px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-1 rounded-full bg-[#0a2540] text-[#57fae9] shadow-xs active:scale-95 transition-transform"
          >
            {isParentView ? 'PARENT' : 'STUDENT'}
          </button>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-white"
            >
              {userProfile?.name?.charAt(0) || 'S'}
            </Link>
          </Show>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#000f22]/50 z-50 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`fixed left-0 top-0 z-50 h-[100dvh] w-72 max-w-[85vw] md:w-64 bg-[#ffffff] border-r border-[#c4c6ce]/40 shadow-2xl md:shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col py-5 px-3.5 sm:px-4 gap-2 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header + Mobile Close */}
        <div className="flex items-center justify-between px-2 pb-4 border-b border-[#c4c6ce]/30 mb-2">
          <Link href="/home" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 no-underline group flex-1">
            <div className="w-10 h-10 min-w-[40px] min-h-[40px] shrink-0 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="PocketBank Logo" className="w-8 h-8 object-contain shrink-0" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="text-[22px] sm:text-[23px] font-black tracking-tight text-[#0a2540] leading-none">
                Pocket<span className="text-[#0d9488]">Bank</span>
              </span>
              <span className="text-[11px] font-bold text-[#74777e] tracking-wide mt-1 leading-none">
                {isParentView ? 'Parent Control' : 'Student Edition'}
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-[#74777e] hover:text-[#000f22] rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* User Mini Profile in Sidebar (Mobile Friendly Drawer Only) */}
        <div className="md:hidden px-3 py-2.5 bg-slate-50 border border-slate-200/70 rounded-xl mb-1 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {userProfile?.name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">{userProfile?.name || 'Sagar Pathak'}</p>
            <p className="text-[10px] font-mono text-teal-700 truncate leading-tight mt-0.5">{userProfile?.studentId || 'STU-2026-8942'}</p>
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
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-[14.5px] transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#57fae9] text-[#007168] font-extrabold shadow-xs'
                    : 'text-[#334155] hover:text-[#000f22] hover:bg-[#e5e8eb]/60'
                }`}
              >
                <span className={`material-symbols-outlined icon-md ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions: Parent/Student View Switcher & Logout */}
        <div className="pt-3 border-t border-[#c4c6ce]/30 mt-auto space-y-2">
          <button
            onClick={toggleParentView}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold font-mono transition-all duration-200 flex items-center justify-center gap-2 ${
              isParentView
                ? 'bg-[#0a2540] text-[#57fae9] border-[#0a2540]'
                : 'border-[#74777e]/30 text-[#000f22] hover:bg-[#f1f4f7]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isParentView ? 'person' : 'supervisor_account'}
            </span>
            <span className="truncate">{isParentView ? 'Switch to Student' : 'Switch to Parent'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};
