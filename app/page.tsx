'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/nextjs';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';

/* ─── Coverflow Carousel ─── */
const coverCards = [
  {
    label: 'Sovereign Card', badge: 'PB-STUDENT',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="w-full h-44 rounded-xl bg-gradient-to-br from-[#0a2540] via-[#0f3b66] to-teal-700 p-4 flex flex-col justify-between relative overflow-hidden shadow-md text-white">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-teal-400/20 blur-xl" />
          <div className="flex justify-between items-start">
            <div className="w-9 h-7 rounded bg-amber-400 opacity-90" />
            <span className="text-[10px] tracking-widest text-slate-200 font-semibold">POCKETBANK</span>
          </div>
          <div>
            <p className="text-sm text-teal-200 tracking-widest font-mono">•••• •••• •••• 4092</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <span className="text-[9px] uppercase text-slate-300 block">Cardholder</span>
                <span className="text-xs font-bold text-white">AARAV SHARMA</span>
              </div>
              <span className="text-xs text-slate-300 font-mono">08/29</span>
            </div>
          </div>
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600 icon-sm">verified</span>
            <span className="text-xs text-[#0a2540] font-medium">NFC + Tap to Pay Enabled</span>
          </div>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold uppercase">Active</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Student Ledger', badge: '● Live',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div>
          <span className="text-xs text-[#4a5568]">Available Campus Balance</span>
          <p className="text-3xl font-bold text-[#0a2540] mt-1 font-mono">₹14,850<span className="text-slate-400 text-lg font-normal">.40</span></p>
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md font-medium">
            <span className="material-symbols-outlined icon-sm">trending_up</span> +₹3,200 from Dad this month
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['send', 'teal', 'Pay UPI'], ['savings', 'sky', 'Vault'], ['receipt_long', 'slate', 'Passbook']].map(([icon, c, label], i) => (
            <div key={i} className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 text-center flex flex-col items-center">
              <span className={`material-symbols-outlined icon-md mb-1 text-${c}-600`}>{icon}</span>
              <span className="text-[11px] font-medium text-[#0a2540]">{label}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#4a5568] font-medium">Daily Budget Remaining</span>
          <span className="font-mono text-xs text-[#0a2540] font-bold">₹650 / ₹1,000</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Target Vault', badge: '4.5% APY',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col items-center text-center flex-1 justify-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
            <span className="material-symbols-outlined icon-xl">laptop_mac</span>
          </div>
          <h2 className="text-lg font-bold text-[#0a2540]">M3 MacBook Air</h2>
          <p className="text-xs text-[#4a5568]">Target: ₹92,000</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-xs text-[#0a2540]">
            <span>Accumulated: ₹62,560</span><span className="text-teal-700 font-bold">68%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-sky-600 rounded-full w-[68%]" />
          </div>
          <p className="text-[11px] text-[#4a5568] text-center">Spare change round-ups adding ~₹180/day</p>
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#0a2540] font-medium">Auto-lock until goal</span>
          <span className="material-symbols-outlined text-teal-600 icon-sm">lock</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Instant Split', badge: 'Zero Surcharge',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center relative mb-2">
            <span className="material-symbols-outlined text-sky-600 icon-xl">bolt</span>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a2540] text-[10px] text-white flex items-center justify-center font-bold">₹</span>
          </div>
          <p className="text-3xl font-bold text-[#0a2540] font-mono">₹340.00</p>
          <p className="text-xs text-[#4a5568] mt-0.5">Campus Canteen Shared Bill</p>
        </div>
        <div className="space-y-2">
          {[{ n: 'Riya Sen (IIT-B)', s: 'SETTLED' }, { n: 'Kabir Mehta', s: 'SETTLED' }].map((p, i) => (
            <div key={i} className="flex items-center justify-between bg-[#f1f4f7] border border-slate-100 p-2 rounded-lg">
              <span className="text-xs font-medium text-[#0a2540]">{p.n}</span>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">{p.s}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#4a5568] font-medium">UPI Auto-Reconciliation</span>
          <span className="material-symbols-outlined text-teal-600 icon-sm">done_all</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Academic Bounty', badge: 'APPROVED',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#f1f4f7] border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0a2540]">Semester Math Revision</span>
              <span className="font-mono text-xs text-teal-700 font-bold">+₹400</span>
            </div>
            <p className="text-[11px] text-[#4a5568]">Uploaded proof verified & credited to Card.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f1f4f7] border border-slate-100 opacity-80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0a2540]">Read 'Psychology of Money'</span>
              <span className="font-mono text-xs text-sky-700 font-bold">+₹300</span>
            </div>
            <p className="text-[11px] text-[#4a5568]">Assigned by Guardian • 2 days left</p>
          </div>
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#4a5568] font-medium">Unlocked by Mother</span>
          <span className="material-symbols-outlined text-teal-600 icon-sm">verified_user</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Parent Console', badge: '🛡',
    content: (
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="space-y-2.5">
          {[
            { l: 'Daily Debit Cap', s: 'Max spend ₹800/day', on: true },
            { l: 'Gaming / In-app Purchases', s: 'Automatic MCC Block', on: false },
            { l: 'ATM Physical Withdrawals', s: 'PIN required each time', on: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#f1f4f7] border border-slate-100">
              <div>
                <p className="text-xs font-bold text-[#0a2540]">{item.l}</p>
                <p className="font-mono text-[11px] text-[#4a5568]">{item.s}</p>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 flex items-center ${item.on ? 'justify-end bg-[#0a2540]' : 'bg-slate-200'}`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#f1f4f7] border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
          <span className="text-xs text-[#4a5568] font-medium">Instant 1-Tap Card Freeze</span>
          <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">STANDBY</span>
        </div>
      </div>
    ),
  },
];

function CoverflowCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const total = coverCards.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (isAuto) { intervalRef.current = setInterval(next, 3500); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAuto, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartRef.current = null;
  };

  const getStyle = (idx: number): React.CSSProperties => {
    let offset = idx - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    if (offset === 0) return { transform: 'translateX(0%) translateZ(100px) rotateY(0deg) scale(1)', opacity: 1, zIndex: 30, boxShadow: '0 20px 50px -10px rgba(10,37,64,0.18)', pointerEvents: 'auto' };
    if (offset === 1) return { transform: 'translateX(70%) translateZ(-70px) rotateY(-30deg) scale(0.85)', opacity: 0.7, zIndex: 20, boxShadow: 'none', pointerEvents: 'none' };
    if (offset === -1) return { transform: 'translateX(-70%) translateZ(-70px) rotateY(30deg) scale(0.85)', opacity: 0.7, zIndex: 20, boxShadow: 'none', pointerEvents: 'none' };
    if (offset >= 2) return { transform: 'translateX(130%) translateZ(-140px) rotateY(-40deg) scale(0.7)', opacity: 0.15, zIndex: 10, boxShadow: 'none', pointerEvents: 'none' };
    return { transform: 'translateX(-130%) translateZ(-140px) rotateY(40deg) scale(0.7)', opacity: 0.15, zIndex: 10, boxShadow: 'none', pointerEvents: 'none' };
  };

  return (
    <div
      className="w-full mt-10 sm:mt-16 md:mt-24 relative select-none overflow-hidden sm:overflow-visible pb-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between max-w-md mx-auto mb-6 sm:mb-8 px-4">
        <button onClick={prev} aria-label="Previous card" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-[#0a2540] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs active:scale-95">
          <span className="material-symbols-outlined icon-sm">chevron_left</span>
        </button>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {coverCards.map((_, i) => (
              <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 sm:w-6 h-2 bg-[#0d9488]' : 'w-2 h-2 bg-slate-300'}`} />
            ))}
          </div>
          <button onClick={() => setIsAuto((a) => !a)} className="px-2.5 sm:px-3 py-1 rounded-full bg-white border border-slate-200 text-teal-700 text-[11px] sm:text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors shadow-xs uppercase">
            <span className="material-symbols-outlined text-[14px] sm:text-base">{isAuto ? 'pause' : 'play_arrow'}</span>
            <span>{isAuto ? 'AUTO' : 'PAUSED'}</span>
          </button>
        </div>
        <button onClick={next} aria-label="Next card" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-[#0a2540] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs active:scale-95">
          <span className="material-symbols-outlined icon-sm">chevron_right</span>
        </button>
      </div>
      <div className="relative w-full h-[420px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-visible" style={{ perspective: '1000px' }}>
        {coverCards.map((card, idx) => (
          <div key={idx} onClick={() => setCurrent(idx)}
            style={{ ...getStyle(idx), transformStyle: 'preserve-3d', transition: 'all 0.45s ease', cursor: 'pointer' }}
            className="absolute w-[285px] sm:w-[340px] md:w-[380px] h-[385px] sm:h-[400px] md:h-[430px] rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 flex flex-col shadow-[0_12px_35px_rgba(10,37,64,0.08)]">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#4a5568] uppercase tracking-widest">{card.label}</span>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">{card.badge}</span>
            </div>
            <div className="flex flex-col flex-1">{card.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityToggle({ label, sub, icon, iconColor, defaultOn }: { label: string; sub: string; icon: string; iconColor: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f1f4f7] border border-slate-100">
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined icon-md ${iconColor}`}>{icon}</span>
        <div>
          <p className="text-xs font-bold text-[#0a2540]">{label}</p>
          <p className="text-[10px] text-[#4a5568]">{sub}</p>
        </div>
      </div>
      <button onClick={() => setOn(v => !v)} className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${on ? 'bg-[#0a2540]' : 'bg-slate-200'}`}>
        <span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/home');
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="bg-[#f7fafd] text-[#0a2540] min-h-screen" style={{ fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        .pb-glow { animation: pb-ping 2s ease-in-out infinite; }
        @keyframes pb-ping { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        .pb-cta { transition: transform .2s, box-shadow .2s; }
        .pb-cta:hover { transform: scale(1.02); box-shadow: 0 6px 22px rgba(10,37,64,0.3); }
        .pb-card { transition: box-shadow .3s; }
        .pb-card:hover { box-shadow: 0 8px 30px rgba(10,37,64,0.10) !important; }
        .pb-nav a:hover { color: #0a2540 !important; }
        .pb-footlink:hover { color: #0d9488 !important; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-3 sm:top-[14px] left-0 right-0 z-50 px-3.5 sm:px-6 md:px-8 max-w-[1240px] mx-auto transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_30px_-5px_rgba(10,37,64,0.08),0_2px_8px_rgba(10,37,64,0.03)] rounded-full px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">

          {/* Brand */}
          <a href="#" className="flex items-center gap-2 sm:gap-2.5 no-underline group shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-white shadow-xs border border-slate-200/80 p-0.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0">
              <Image src="/logo.png" alt="PocketBank Logo" width={36} height={36} className="object-contain" priority />
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-black text-lg sm:text-[22px] text-[#0a2540] tracking-tight group-hover:text-teal-900 transition-colors inline-block">
                Pocket<span className="text-[#0d9488]">Bank</span>
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200/60 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                STUDENT
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="pb-nav hidden lg:flex items-center gap-1 bg-slate-50/90 p-1 rounded-full border border-slate-200/80 shrink-0 whitespace-nowrap">
            {[
              ['Features', '#features', 'bolt'],
              ['How It Works', '#how-it-works', 'account_tree'],
              ['Security', '#security', 'shield'],
              ['Reviews', '#reviews', 'star'],
            ].map(([label, href, icon]) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13.5px] font-bold text-[#334155] hover:text-[#0a2540] hover:bg-white hover:shadow-xs transition-all duration-200 no-underline whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-teal-600 font-bold">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-full text-[13.5px] font-bold text-[#0a2540] hover:text-[#0d9488] hover:bg-slate-100/80 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                <button
                  type="button"
                  className="pb-cta hidden min-[501px]:inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-black uppercase tracking-wider text-white no-underline shadow-[0_4px_16px_rgba(10,37,64,0.25)] hover:shadow-[0_6px_24px_rgba(13,148,136,0.35)] group transition-all cursor-pointer whitespace-nowrap shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #0a2540 0%, #0f3d6b 60%, #0d9488 100%)',
                  }}
                >
                  <span>Open Account</span>
                  <span className="material-symbols-outlined text-xs sm:text-sm font-bold transition-transform duration-200 group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/home"
                className="hidden min-[421px]:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-extrabold text-[#007168] bg-[#57fae9]/40 hover:bg-[#57fae9] transition-all no-underline shadow-2xs whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                <span>Dashboard</span>
              </Link>
              <UserButton />
            </Show>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="flex lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 border border-slate-200 items-center justify-center text-[#0a2540] cursor-pointer transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {[
              ['Features', '#features', 'bolt'],
              ['How It Works', '#how-it-works', 'account_tree'],
              ['Security', '#security', 'shield'],
              ['Reviews', '#reviews', 'star'],
            ].map(([label, href, icon]) => (
              <a
                key={label}
                onClick={() => setMobileOpen(false)}
                href={href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-bold text-[#0a2540] hover:bg-slate-50 transition-colors no-underline"
              >
                <span className="material-symbols-outlined text-teal-600 text-[20px]">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
            <div className="pt-2 mt-1 border-t border-slate-100 flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#0a2540] hover:bg-slate-50 cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-[#0a2540] text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/home"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#0a2540] text-white text-sm font-bold uppercase tracking-wider no-underline shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <UserButton />
              </Show>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="pt-[66px] sm:pt-[98px] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full" style={{ background: 'linear-gradient(135deg, rgba(186,230,253,0.5), rgba(204,251,241,0.6), rgba(199,210,254,0.4))', filter: 'blur(120px)' }} />
        <div className="pointer-events-none absolute top-[1400px] -left-48 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(204,251,241,0.35)', filter: 'blur(140px)' }} />
        <div className="pointer-events-none absolute top-[2600px] -right-48 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(186,230,253,0.35)', filter: 'blur(140px)' }} />

        {/* HERO */}
        <section className="relative w-full pt-8 sm:pt-16 md:pt-20 pb-14 sm:pb-20 md:pb-28 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center text-center relative z-10">
            <ScrollReveal direction="up" distance={40} duration={0.6}>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4 sm:mb-6 max-w-full">
                <span className="pb-glow w-2 h-2 rounded-full bg-[#0d9488] shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#0d9488] tracking-wider truncate">Next-Gen Student Banking • RBI Regulated Partner</span>
              </div>

              <h1 className="font-extrabold text-[#0a2540] max-w-4xl mx-auto" style={{ fontSize: 'clamp(28px,7.5vw,58px)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
                Banking Built for Students.{' '}
                <br className="hidden sm:inline" />
                <span style={{ background: 'linear-gradient(to right, #0d9488, #0284c7, #0a2540)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Trusted by Parents.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#4a5568] max-w-2xl mt-3 sm:mt-4 mb-8 sm:mb-10 leading-relaxed px-2 mx-auto">
                Zero hidden fees. High-yield savings. Instant P2P transfers with parent-guided smart limits engineered for sovereign financial independence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
                <Show when="signed-out">
                  <SignUpButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                    <button
                      type="button"
                      className="pb-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-7 py-3 sm:py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                      style={{ background: '#0a2540', boxShadow: '0 4px 18px rgba(10,37,64,0.22)' }}
                    >
                      <span>Open an Account</span>
                      <span className="material-symbols-outlined icon-sm">arrow_forward</span>
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/home"
                    className="pb-cta w-full sm:w-auto justify-center inline-flex items-center gap-2 px-7 py-3 sm:py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white no-underline"
                    style={{ background: '#0a2540', boxShadow: '0 4px 18px rgba(10,37,64,0.22)' }}
                  >
                    <span>Go to Dashboard</span>
                    <span className="material-symbols-outlined icon-sm">arrow_forward</span>
                  </Link>
                </Show>
                <a href="#how-it-works" className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-7 py-3 sm:py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0a2540] bg-white border border-slate-200 hover:bg-slate-50 shadow-sm no-underline transition-all">
                  <span className="material-symbols-outlined text-[#0d9488] icon-sm">play_circle</span>
                  <span>See How It Works</span>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={0.2} duration={0.6} className="w-full">
              <CoverflowCarousel />
            </ScrollReveal>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="w-full py-4 sm:py-8">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <StaggerContainer className="rounded-2xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(10,37,64,0.04)] p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: 'enhanced_encryption', bg: 'bg-teal-50 border-teal-100', color: 'text-teal-700', title: '256-Bit Military Grade', sub: 'End-to-end telemetry' },
                { icon: 'account_balance', bg: 'bg-sky-50 border-sky-100', color: 'text-sky-700', title: 'RBI-Compliant Partner', sub: 'Scheduled bank backing' },
                { icon: 'price_check', bg: 'bg-indigo-50 border-indigo-100', color: 'text-indigo-700', title: 'Zero Hidden Charges', sub: 'No annual maintenance fees' },
                { icon: 'family_restroom', bg: 'bg-slate-100 border-slate-200', color: 'text-[#0a2540]', title: '24/7 Guardian Oversight', sub: 'Parent telemetry link' },
              ].map((item, i) => (
                <StaggerItem key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.bg}`}>
                    <span className={`material-symbols-outlined icon-md ${item.color}`}>{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0a2540]">{item.title}</p>
                    <p className="text-[11px] text-[#4a5568]">{item.sub}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="w-full py-14 sm:py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <ScrollReveal direction="up" distance={30} duration={0.5} className="max-w-2xl mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-3">
                <span className="material-symbols-outlined text-[#0d9488] icon-sm">tune</span>
                <span className="text-xs font-semibold uppercase text-[#0d9488]">Next-Gen Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a2540] tracking-tight">High-Precision Banking for High-Growth Minds.</h2>
              <p className="text-sm sm:text-base text-[#4a5568] mt-2">Engineered without legacy bank bloatware. Clean ergonomics, programmable goal vaults, and uncompromised transparency.</p>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              {/* Smart Savings */}
              <StaggerItem className="pb-card md:col-span-7 rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.05)]">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-teal-700 icon-lg">savings</span>
                  </div>
                  <span className="font-mono text-base sm:text-xl font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">4.5% APY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a2540]">Smart Savings & Multi-Vaults</h3>
                <p className="text-sm text-[#4a5568] mt-2 max-w-lg leading-relaxed">Automate daily round-ups on campus snacks, lock funds into bespoke target vaults, and earn institutional-grade interest calculated daily and paid monthly.</p>
                <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl bg-[#f1f4f7] border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-3">
                    <span className="text-xs font-medium text-[#4a5568]">Savings Trajectory (Round-Ups Included)</span>
                    <span className="font-mono text-xs text-teal-700 font-bold">+34.8% vs Standard Savings</span>
                  </div>
                  <svg width="100%" height="64" fill="none" viewBox="0 0 400 60" preserveAspectRatio="none" className="text-teal-600">
                    <path d="M0,50 Q60,45 120,38 T240,25 T360,10 L400,6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M0,50 Q60,45 120,38 T240,25 T360,10 L400,6 L400,60 L0,60 Z" fill="currentColor" fillOpacity="0.1" />
                  </svg>
                </div>
              </StaggerItem>

              {/* Instant Transfers */}
              <StaggerItem className="pb-card md:col-span-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.05)]">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sky-600 icon-lg">qr_code_scanner</span>
                  </div>
                  <span className="text-xs font-bold text-sky-700 uppercase bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">Sub-Second</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a2540]">Instant Transfers & QR Splits</h3>
                <p className="text-sm text-[#4a5568] mt-2 leading-relaxed">Zero-fee campus UPI. Split hostel laundry, cafeteria food, or books instantly without awkward ledger calculations.</p>
                <div className="mt-6 sm:mt-8 space-y-2.5">
                  {[{ init: 'RS', name: 'Campus Mess Split', amt: '₹120 • Done', bg: 'bg-sky-600' }, { init: 'KM', name: 'Printouts Xerox', amt: '₹45 • Done', bg: 'bg-teal-600' }].map((t, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#f1f4f7] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${t.bg} flex items-center justify-center text-[11px] font-bold text-white`}>{t.init}</div>
                        <span className="text-xs font-semibold text-[#0a2540] truncate max-w-[140px] sm:max-w-none">{t.name}</span>
                      </div>
                      <span className="font-mono text-xs text-[#0a2540] font-bold shrink-0">{t.amt}</span>
                    </div>
                  ))}
                </div>
              </StaggerItem>

              {/* Milestone Rewards */}
              <StaggerItem className="pb-card md:col-span-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 md:p-10 shadow-[0_4px_20px_rgba(10,37,64,0.05)]">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600 icon-lg">military_tech</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">Earn Allowance</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a2540]">Milestone-Based Rewards</h3>
                <p className="text-sm text-[#4a5568] mt-2 leading-relaxed">Parents set bounties for academic performance, household chores, or reading challenges. Allowance is earned, not just handed out.</p>
                <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl bg-[#f1f4f7] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0a2540]">Physics Mock Test A+</p>
                    <p className="text-[11px] text-[#4a5568]">Auto-transferred to M3 Vault</p>
                  </div>
                  <span className="font-mono text-sm text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded shrink-0">+₹1,000</span>
                </div>
              </StaggerItem>

              {/* Guardian Console */}
              <StaggerItem className="pb-card md:col-span-7 rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 md:p-10 shadow-[0_4px_20px_rgba(10,37,64,0.05)]">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0a2540] icon-lg">admin_panel_settings</span>
                  </div>
                  <span className="text-xs font-bold text-[#0a2540] uppercase bg-slate-100 px-3 py-1 rounded-full">Guarded Liberty</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a2540]">Guardian Oversight Console</h3>
                <p className="text-sm text-[#4a5568] mt-2 max-w-lg leading-relaxed">Autonomous freedom within safe guardrails. Dynamic daily spending caps, one-click ATM lock, and automatic merchant categorization alerts.</p>
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Category Filter', value: 'Gaming Restrict', color: 'text-[#0a2540]' },
                    { label: 'Immediate Action', value: '1-Tap Card Freeze', color: 'text-rose-700' },
                    { label: 'Real-Time Notice', value: 'Instant Push & SMS', color: 'text-teal-700' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#f1f4f7] border border-slate-100 flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-[#4a5568]">{item.label}</span>
                      <span className={`text-xs font-bold mt-1 ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full py-14 sm:py-20 md:py-28 bg-[#f1f4f7]/60 border-y border-slate-200/80">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <ScrollReveal direction="up" distance={30} duration={0.5} className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
              <span className="text-xs font-semibold uppercase text-[#0d9488] tracking-wider bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">Effortless Onboarding</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a2540] mt-3">Up and Running in Under 180 Seconds.</h2>
              <p className="text-sm sm:text-base text-[#4a5568] mt-2 leading-relaxed">No physical paper stacks. No branch queues. Seamless dual-app sync for student and parent.</p>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { num: '01', numColor: 'text-teal-700', icon: 'badge', iconBg: 'bg-teal-50 border-teal-100', iconColor: 'text-teal-700', title: '2-Min Digital KYC', desc: 'Scan student ID card & connect Aadhaar via secure DigiLocker token. Instant identity confirmation with scheduled banking partners.' },
                { num: '02', numColor: 'text-sky-700', icon: 'link', iconBg: 'bg-sky-50 border-sky-100', iconColor: 'text-sky-700', title: 'Guardian Link', desc: 'Parent enters phone number to link their master console. Set daily budgets, approved merchants, and automated monthly allowance schedules.' },
                { num: '03', numColor: 'text-[#0a2540]', icon: 'rocket_launch', iconBg: 'bg-slate-100 border-slate-200', iconColor: 'text-[#0a2540]', title: 'Save & Transact', desc: 'Virtual debit card is generated immediately. Physical holographic chip card arrives at campus or home in 3 working days.' },
              ].map((step, i) => (
                <StaggerItem key={i} className="bg-white border border-slate-200 p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(10,37,64,0.04)]">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className={`font-mono text-2xl sm:text-3xl font-bold ${step.numColor}`}>{step.num}</span>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.iconBg}`}>
                      <span className={`material-symbols-outlined icon-md ${step.iconColor}`}>{step.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0a2540]">{step.title}</h3>
                  <p className="text-sm text-[#4a5568] mt-2 leading-relaxed">{step.desc}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="w-full py-14 sm:py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 mb-12 sm:mb-20">
              {[
                { value: '₹12Cr+', label: 'Student Savings Vaults', color: 'text-[#0a2540]' },
                { value: '50,000+', label: 'Active Student Accounts', color: 'text-teal-700' },
                { value: '4.8★', label: 'Play Store & iOS Rating', color: 'text-amber-600' },
                { value: '0', label: 'Fraud Incidents Reported', color: 'text-sky-700' },
              ].map((stat, i) => (
                <StaggerItem key={i} className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <p className={`font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#4a5568] mt-1 uppercase font-semibold tracking-wider">{stat.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <ScrollReveal direction="up" distance={30} duration={0.5} className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="text-xs font-semibold uppercase text-[#0d9488] tracking-wider bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">Verified Perspectives</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a2540] mt-3">Trusted by Students. Relied Upon by Guardians.</h2>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { quote: '"PocketBank saved me from constantly asking my dad for money transfers during exam semester. The auto round-up helped me buy my mechanical keyboard in 3 months!"', name: 'Aditya Roy', role: 'Computer Science, BITS Pilani', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC7mv6hcD5WCSeZiL13Ba9BpEVr9i0B21LxwLuuq1Cj4aJJptlTXam3pS_eexjrEUD9M_SK8xLP8ZZ7AKrQXOswXPggRqBb0cJHXZUYKf0A0N9G6qIPYaOGEtwIoQzjdThyQ45xvP9Tj2cYiES1DT-2FFw9qDVSY6p--jqhE846m6K0B5Wl4Tb8WGqbolEe3ktNFcNiX8Y7ZC4VHq-TYm23jwamFAflaFHvqLMTmyb1QEX3cDrd8gW0g' },
                { quote: '"As a parent, handing a debit card to a 17-year-old was terrifying until PocketBank. I set a ₹500 daily food cap and can turn off online shopping whenever needed."', name: 'Meenakshi Sundaram', role: 'Mother of 1st-year Delhi Univ Student', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRSywwbFkg8XtaafwVD27ukBub63WgSdMEfPXp_QkPlNmF4Ysihyg-nzLUJZcd7JuVkJNmrVy8ckm0Uxll3bqcYeIb7LWecufbXiCad_zH6Em7Z_s35NxEgqVN95b8eVoc5TvDv9NJX0NKCWkc9J4Lv86fuvmnzUX9ZcpsbUgQ4xEypung3Smma4ixcOU6ZFbKUbkaeL5tdmqpRIdj3hvwY9BVQ2PSk0oyUUG27EmRpDu5jV2AG6MEaA' },
                { quote: '"The app feels like something Apple would build if they did student banking. The UPI tap speed is crazy fast, and the physical card finish looks super clean."', name: 'Tanvi Deshmukh', role: 'Design Major, NID Ahmedabad', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7PKmoMybSgfjIBrEt4DpCE4V3A7RK3-zTPHYlwej30dGK50xe0lTaPPkrK-Rzx3XUFfvnKWuT68pSdUnHfOSgcgt2xa94HqIygfjcill7nRpI0gca6Aacnu_-suxK_0HxVMu_2HZ3b8NO1xRXn_2sGdRFo4nG1fcFp9fkgDMdEboehbFXZLsNHIY6fcNtpUVrt7qw-CZNBcHF81-kAkY3rpoEmF1r61bJ4Rjv7lAmhk2f5BJlxI4MiQ' },
              ].map((t, i) => (
                <StaggerItem key={i} className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(10,37,64,0.05)]">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(5)].map((_, s) => <span key={s} className="material-symbols-outlined icon-sm">star</span>)}
                    </div>
                    <p className="text-sm text-[#4a5568] leading-relaxed">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 sm:pt-6 mt-6 border-t border-slate-100">
                    <Image src={t.avatar} alt={t.name} width={44} height={44} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border border-slate-200" />
                    <div>
                      <p className="text-xs font-bold text-[#0a2540]">{t.name}</p>
                      <p className="text-[11px] text-[#4a5568]">{t.role}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="w-full py-12 sm:py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <ScrollReveal direction="up" distance={40} duration={0.6}>
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-[0_10px_35px_rgba(10,37,64,0.06)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 mb-4">
                      <span className="material-symbols-outlined text-teal-700 icon-sm">verified_user</span>
                      <span className="text-xs font-semibold uppercase text-teal-700">Dual-Vault Security Engine</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a2540] leading-tight">Uncompromised Safety. Zero Compromise on Independence.</h2>
                    <p className="text-sm text-[#4a5568] mt-3 sm:mt-4 leading-relaxed">PocketBank operates with zero overdraft risk. Accounts cannot go into negative balance. Automated merchant code restriction blocks high-risk platforms while preserving student autonomy for everyday purchases.</p>
                    <div className="mt-5 sm:mt-6 space-y-3">
                      {[
                        { icon: 'fingerprint', color: 'text-teal-700', text: 'Biometric FaceID & TouchID Authorization' },
                        { icon: 'block', color: 'text-amber-600', text: 'Automatic MCC Blocking on Gaming & Gambling' },
                        { icon: 'notification_important', color: 'text-sky-600', text: 'Immediate Push Notifications for Transactions >₹200' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className={`material-symbols-outlined icon-md ${item.color}`}>{item.icon}</span>
                          <span className="text-xs sm:text-sm font-medium text-[#0a2540]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#f7fafd] border border-slate-200 p-4 sm:p-6 space-y-3.5 sm:space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#0a2540]">Live Parent Guardrail Controls</h4>
                        <p className="text-[11px] text-[#4a5568]">Changes reflect immediately on student debit card</p>
                      </div>
                      <span className="material-symbols-outlined icon-lg text-[#0a2540]">phonelink_lock</span>
                    </div>
                    <SecurityToggle label="Instant Card Freeze" sub="Lock all physical & virtual swipes instantly" icon="credit_card_off" iconColor="text-[#0a2540]" defaultOn={true} />
                    <SecurityToggle label="International Swipes" sub="Foreign currency transactions" icon="public" iconColor="text-sky-600" defaultOn={false} />
                    <SecurityToggle label="ATM Withdrawal Access" sub="Allow student to dispense cash at ATMs" icon="local_atm" iconColor="text-teal-600" defaultOn={true} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section id="open-account" className="w-full py-14 sm:py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <ScrollReveal direction="up" distance={40} duration={0.6}>
              <div className="rounded-3xl p-6 sm:p-12 md:p-20 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0f3b66 50%, #0d9488 100%)', boxShadow: '0 20px 60px rgba(10,37,64,0.25)' }}>
                <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full" style={{ background: 'rgba(13,148,136,0.2)', filter: 'blur(80px)' }} />
                <div className="max-w-2xl mx-auto relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm mb-4 sm:mb-6">
                    <span className="material-symbols-outlined icon-sm text-teal-300">bolt</span>
                    <span className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider">Instant Digital Issuance</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">Open a PocketBank Student Account Today.</h2>
                  <p className="text-sm sm:text-base text-white/70 mt-3 mb-8 sm:mb-10 leading-relaxed">Step into the next chapter of smart campus money. Free account opening with zero balance requirement and custom holographic debit card.</p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                    <div className="relative w-full">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-white/60">+91</span>
                      <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Mobile Number"
                        className="w-full pl-14 pr-4 py-3 sm:py-3.5 rounded-full bg-white/10 text-white font-mono text-sm placeholder:text-white/40 outline-none border border-white/20 focus:border-teal-300 focus:ring-2 focus:ring-teal-400/30 transition-all" />
                    </div>
                    <Show when="signed-out">
                      <SignUpButton mode="modal" fallbackRedirectUrl="/home" forceRedirectUrl="/home">
                        <button
                          type="button"
                          className="pb-cta w-full sm:w-auto shrink-0 px-8 py-3 sm:py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-[#0a2540] text-center cursor-pointer"
                          style={{ background: '#ffffff', boxShadow: '0 4px 18px rgba(255,255,255,0.25)', display: 'inline-block' }}
                        >
                          Claim Card
                        </button>
                      </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                      <Link
                        href="/home"
                        className="pb-cta w-full sm:w-auto shrink-0 px-8 py-3 sm:py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider no-underline whitespace-nowrap text-[#0a2540] text-center"
                        style={{ background: '#ffffff', boxShadow: '0 4px 18px rgba(255,255,255,0.25)', display: 'inline-block' }}
                      >
                        Go to Dashboard
                      </Link>
                    </Show>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-white/50 mt-4">By entering your number, you agree to receive SMS verification. Partnered with RBI-regulated banking institution.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f1f4f7] border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 pb-8 sm:pb-10">
            <div className="col-span-2 sm:col-span-3 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Image src="/logo.webp" alt="PocketBank Logo" width={32} height={32} className="object-contain" />
                <span className="font-bold text-lg text-[#0a2540]">Pocket<span className="text-[#0d9488]">Bank</span></span>
              </div>
              <p className="text-xs sm:text-sm text-[#4a5568] max-w-xs">Engineered for sovereign liquidity and modern digital capital. Secure institutional vaults, high-frequency yield, and uncompromised privacy.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[{ icon: 'verified_user', label: 'SOC-2 TYPE II', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100' }, { icon: 'lock', label: '256-BIT AES', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-100' }].map((b, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold border ${b.color} ${b.bg}`}>
                    <span className={`material-symbols-outlined icon-sm ${b.color}`}>{b.icon}</span>{b.label}
                  </span>
                ))}
              </div>
            </div>
            {[
              { heading: 'Architecture', links: ['Quantum Engine', 'Virtual Shield', 'Multi-Asset Ledger', 'API Integration'] },
              { heading: 'Governance', links: ['Institutional Custody', 'Reserve Proofs', 'Audit Reports', 'Compliance Matrix'] },
              { heading: 'Platform', links: ['Client Testimonials', 'Global Ticker', 'Press Coverage', 'System Status'] },
              { heading: 'Regulatory', links: ['Privacy Architecture', 'Client Agreement', 'Risk Disclosures', 'FDIC Pass-Through'] },
            ].map((col) => (
              <div key={col.heading} className="col-span-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0a2540] mb-2 sm:mb-3">{col.heading}</p>
                <ul className="space-y-1.5 sm:space-y-2 list-none p-0 m-0">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="pb-footlink text-xs sm:text-sm text-[#4a5568] no-underline transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="pb-glow w-2 h-2 rounded-full bg-teal-500 inline-block" />
              <span className="font-mono text-[11px] sm:text-xs text-[#4a5568]">POCKET-NET V4.89 ACTIVE</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#74777e]">© 2026 PocketBank Technologies AG. Sovereign institutional banking infrastructure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
