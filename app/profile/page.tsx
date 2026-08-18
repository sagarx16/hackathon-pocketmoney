'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

const fmt = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export default function ProfilePage() {
  const { userProfile, accounts, transactions, chores, addToast, isParentView } = useBank();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalEarned = transactions.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const completedChores = chores.filter((c) => c.status === 'VERIFIED_PAID').length;

  const activityLog = [
    { icon: 'login', label: 'Login from Mac · Chrome · Mumbai', time: '2 days ago', color: '#006a62' },
    { icon: 'credit_card', label: 'Virtual card created', time: '5 days ago', color: '#0a2540' },
    { icon: 'verified_user', label: 'KYC verified by institution', time: '14 Aug 2026', color: '#006a62' },
    { icon: 'lock_reset', label: 'Password changed', time: '1 Aug 2026', color: '#ba1a1a' },
  ];

  const settings = [
    { icon: 'notifications', label: 'Push Notifications', sub: 'Transaction alerts & reminders', active: true },
    { icon: 'fingerprint', label: 'Biometric Login', sub: 'Use Face ID / Fingerprint', active: true },
    { icon: 'language', label: 'Two-Factor Auth (2FA)', sub: 'SMS OTP on every login', active: false },
    { icon: 'policy', label: 'Spending Reports Email', sub: 'Monthly summary to your inbox', active: true },
  ];

  const [toggles, setToggles] = useState(settings.map((s) => s.active));

  return (
    <div className="min-h-screen bg-[#f7fafd] p-6 md:p-8">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest mb-1">My Account</p>
        <h1 className="text-2xl font-bold text-[#000f22]">Profile & Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ══ LEFT COLUMN ══ */}
        <div className="flex flex-col gap-6">

          {/* ── Avatar Card ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-br from-[#0a2540] via-[#000f22] to-[#006a62] relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #57fae9 0%, transparent 60%)' }} />
            </div>

            <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <button
                  onClick={() => addToast('Photo upload coming soon!', 'info')}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#006a62] text-white flex items-center justify-center shadow-md hover:bg-[#007168] transition-colors"
                >
                  <span className="material-symbols-outlined icon-sm">photo_camera</span>
                </button>
              </div>

              <h2 className="mt-3 text-lg font-bold text-[#000f22]">{userProfile.name}</h2>
              <p className="text-xs font-mono text-[#74777e] mt-0.5">{userProfile.studentId}</p>

              {/* KYC Badge */}
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#57fae9]/30 border border-[#006a62]/20">
                <span className="material-symbols-outlined icon-sm text-[#006a62]">verified</span>
                <span className="text-xs font-bold text-[#006a62]">{userProfile.kycStatus}</span>
              </div>

              <button
                onClick={() => setEditOpen(true)}
                className="mt-4 w-full py-2.5 rounded-xl border border-[#c4c6ce] text-sm font-semibold text-[#000f22] hover:bg-[#f1f4f7] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined icon-sm">edit</span>
                Edit Profile
              </button>
            </div>
          </div>

          {/* ── Quick Stats ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm p-5">
            <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest mb-4">Account Stats</p>
            <div className="space-y-4">
              {[
                { icon: 'account_balance_wallet', label: 'Total Balance', value: fmt(totalBalance), color: '#0a2540' },
                { icon: 'trending_up', label: 'Total Earned', value: fmt(totalEarned), color: '#006a62' },
                { icon: 'emoji_events', label: 'Reward Points', value: `${userProfile.rewardPoints.toLocaleString()} pts`, color: '#ea5c5d' },
                { icon: 'task_alt', label: 'Chores Completed', value: `${completedChores} tasks`, color: '#007168' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stat.color + '15' }}
                  >
                    <span className="material-symbols-outlined icon-sm" style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#74777e]">{stat.label}</p>
                    <p className="text-sm font-bold text-[#000f22] truncate">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Parent Link ── */}
          <div className="bg-[#0a2540] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-[#57fae9]/10" />
            <p className="text-xs font-mono text-[#57fae9] uppercase tracking-widest mb-2">Linked Guardian</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#57fae9]/20 flex items-center justify-center">
                <span className="material-symbols-outlined icon-md text-[#57fae9]">supervisor_account</span>
              </div>
              <div>
                <p className="text-sm font-bold">{userProfile.parentName.split(' (')[0]}</p>
                <p className="text-[11px] text-[#768dad]">Parent / Guardian</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#57fae9] animate-pulse" />
              <span className="text-[11px] text-[#768dad]">Active oversight enabled</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN (spans 2) ══ */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* ── Personal Info ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest">Personal Information</p>
              <button
                onClick={() => setEditOpen(true)}
                className="text-xs font-semibold text-[#006a62] hover:text-[#007168] flex items-center gap-1"
              >
                <span className="material-symbols-outlined icon-sm">edit</span>
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', value: userProfile.name, icon: 'person' },
                { label: 'Student ID', value: userProfile.studentId, icon: 'badge' },
                { label: 'Email Address', value: userProfile.email, icon: 'mail' },
                { label: 'KYC Status', value: userProfile.kycStatus, icon: 'verified_user' },
                { label: 'Account Type', value: 'Student Banking', icon: 'school' },
                { label: 'Member Since', value: 'August 2024', icon: 'calendar_today' },
              ].map((field) => (
                <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#f7fafd]">
                  <span className="material-symbols-outlined icon-sm text-[#43474d] mt-0.5">{field.icon}</span>
                  <div>
                    <p className="text-[10px] font-mono text-[#74777e] uppercase tracking-wider">{field.label}</p>
                    <p className="text-sm font-semibold text-[#000f22] mt-0.5">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Linked Accounts ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm p-6">
            <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest mb-5">Linked Accounts</p>
            <div className="space-y-3">
              {accounts.map((acc) => {
                const icons: Record<string, string> = { CHECKING: 'account_balance', SAVINGS: 'savings', VAULT: 'lock' };
                const colors: Record<string, string> = { CHECKING: '#0a2540', SAVINGS: '#006a62', VAULT: '#290002' };
                return (
                  <div key={acc.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#c4c6ce]/40 hover:bg-[#f7fafd] transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors[acc.type] + '15' }}
                    >
                      <span className="material-symbols-outlined icon-md" style={{ color: colors[acc.type] }}>
                        {icons[acc.type]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#000f22]">{acc.name}</p>
                      <p className="text-xs font-mono text-[#74777e]">{acc.accountNumber}{acc.apy ? ` · ${acc.apy}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#000f22]">{fmt(acc.balance)}</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#57fae9]/20 text-[#007168] font-bold">
                        {acc.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Security & Settings ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm p-6">
            <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest mb-5">Security & Preferences</p>
            <div className="space-y-3">
              {settings.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#f7fafd] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#ebeef1] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined icon-sm text-[#43474d]">{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#000f22]">{s.label}</p>
                    <p className="text-xs text-[#74777e]">{s.sub}</p>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => {
                      setToggles((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
                      addToast(`${s.label} ${!toggles[i] ? 'enabled' : 'disabled'}`, 'info');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 overflow-hidden ${toggles[i] ? 'bg-[#006a62]' : 'bg-[#c4c6ce]'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${toggles[i] ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Activity Log ── */}
          <div className="bg-white rounded-2xl border border-[#c4c6ce]/40 shadow-sm p-6">
            <p className="text-xs font-mono text-[#74777e] uppercase tracking-widest mb-5">Recent Security Activity</p>
            <div className="space-y-3">
              {activityLog.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f7fafd] transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: ev.color + '15' }}
                  >
                    <span className="material-symbols-outlined icon-sm" style={{ color: ev.color }}>{ev.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#000f22]">{ev.label}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#74777e] flex-shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Danger Zone ── */}
          {isParentView && (
            <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-2xl p-6">
              <p className="text-xs font-mono text-[#ba1a1a] uppercase tracking-widest mb-4">Parent Controls</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => addToast('Account suspension requires bank verification.', 'error')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] transition-colors"
                >
                  <span className="material-symbols-outlined icon-sm">block</span>
                  Suspend Student Account
                </button>
                <button
                  onClick={() => addToast('Spending limit override sent to bank.', 'info')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ba1a1a]/40 text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a]/10 transition-colors"
                >
                  <span className="material-symbols-outlined icon-sm">tune</span>
                  Override Spending Limits
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ Edit Profile Modal ══ */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#000f22]/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#c4c6ce]/40 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[#000f22]">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-full bg-[#f1f4f7] flex items-center justify-center hover:bg-[#e5e8eb]">
                <span className="material-symbols-outlined icon-sm text-[#43474d]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#74777e] uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c6ce] focus:outline-none focus:border-[#000f22] text-sm text-[#000f22] bg-[#f7fafd] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#74777e] uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c6ce] focus:outline-none focus:border-[#000f22] text-sm text-[#000f22] bg-[#f7fafd] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#74777e] uppercase tracking-wider block mb-1.5">Student ID</label>
                <input
                  value={userProfile.studentId}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c6ce]/50 text-sm text-[#74777e] bg-[#ebeef1] cursor-not-allowed"
                />
                <p className="text-[10px] text-[#74777e] mt-1 ml-1">Student ID cannot be changed</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 py-3 rounded-xl border border-[#c4c6ce] text-sm font-semibold text-[#43474d] hover:bg-[#f1f4f7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addToast('Profile updated successfully!', 'success');
                  setEditOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#000f22] text-white text-sm font-bold hover:bg-[#0a2540] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
