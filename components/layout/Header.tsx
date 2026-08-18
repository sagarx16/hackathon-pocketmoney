'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBank } from '@/context/BankContext';
import Link from 'next/link';

export const Header: React.FC = () => {
  const router = useRouter();
  const { userProfile, isParentView, addToast, logout } = useBank();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Chore Reward Paid', desc: '₹2,000 added for Straight As Midterm', time: '10m ago', icon: 'emoji_events' },
    { id: 2, title: 'Guardian Allowance', desc: 'Monthly allowance ₹5,000 received', time: '1d ago', icon: 'payments' },
    { id: 3, title: 'Security Alert', desc: 'New login from Mac Chrome in Mumbai', time: '2d ago', icon: 'shield' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToast(`Searching for "${searchQuery}" across transactions and accounts...`, 'info');
    }
  };

  return (
    <header className="hidden md:flex justify-between items-center w-full px-8 h-16 bg-[#f7fafd] border-b border-[#c4c6ce]/30 sticky top-0 z-30">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 bg-[#ffffff] rounded-full px-4 py-2 border border-[#c4c6ce] focus-within:border-[#000f22] transition-colors w-96 shadow-xs">
        <span className="material-symbols-outlined icon-md text-[#74777e]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions, friends, or savings goals..."
          className="bg-transparent border-none focus:outline-none w-full text-sm font-sans text-[#181c1e] placeholder:text-[#74777e]"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Role Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebeef1] border border-[#c4c6ce]/50 text-xs font-mono text-[#000f22]">
          <span className="w-2 h-2 rounded-full bg-[#006a62] animate-pulse"></span>
          <span>{isParentView ? 'Parent Mode' : 'Verified Student'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-[#43474d] hover:bg-[#ebeef1] hover:text-[#000f22] transition-colors relative"
          >
            <span className="material-symbols-outlined icon-lg">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ea5c5d] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#c4c6ce]/50 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-[#c4c6ce]/30 mb-2">
                <h3 className="font-bold text-sm text-[#000f22]">Notifications</h3>
                <span className="text-xs font-mono text-[#007168] bg-[#57fae9] px-2 py-0.5 rounded-full font-bold">3 new</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 p-2 rounded-xl hover:bg-[#f1f4f7] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#0a2540] text-[#57fae9] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined icon-sm">{n.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#000f22]">{n.title}</p>
                      <p className="text-xs text-[#43474d]">{n.desc}</p>
                      <span className="text-[10px] text-[#74777e] font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            addToast('Logged out successfully. You have been signed out.', 'info');
            router.push('/login');
          }}
          className="flex items-center gap-2 rounded-full border border-[#c4c6ce] bg-white px-3 py-2 text-xs font-bold font-mono text-[#000f22] hover:bg-[#f1f4f7] transition-colors"
          aria-label="Logout"
        >
          <span className="material-symbols-outlined icon-md">logout</span>
          <span className="hidden lg:inline">Logout</span>
        </button>

        {/* User Profile */}
        <Link href="/profile" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006a62]"
          />
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-[#000f22] leading-tight">{userProfile.name}</p>
            <p className="text-[11px] font-mono text-[#74777e]">{userProfile.studentId}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};