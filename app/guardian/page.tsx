'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function GuardianPage() {
  const { userProfile, chores, approveChorePayout, addToast } = useBank();

  const [allowance, setAllowance] = useState('10000');
  const [maxSingleLimit, setMaxSingleLimit] = useState('5000');
  const [locks, setLocks] = useState({
    gaming: false,
    gambling: true,
    international: true,
    crypto: true,
  });

  const handleSaveGuardianRules = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Guardian Spending Controls & Allowance updated successfully!', 'success');
  };

  const toggleLock = (key: keyof typeof locks) => {
    setLocks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      addToast(`Merchant category "${key.toUpperCase()}" ${next[key] ? 'Locked' : 'Unlocked'}`, next[key] ? 'info' : 'success');
      return next;
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0a2540] to-[#000f22] p-8 rounded-2xl text-white shadow-xl">
        <div>
          <span className="text-xs font-mono text-[#57fae9] bg-[#006a62]/40 px-3 py-1 rounded-full font-bold">
            GUARDIAN / PARENT DASHBOARD
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            Managing Controls for {userProfile.name}
          </h1>
          <p className="text-sm text-white/70 mt-1">Student ID: {userProfile.studentId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-white/60">PRIMARY GUARDIAN</p>
          <p className="text-sm font-bold">{userProfile.parentName}</p>
        </div>
      </div>

      {/* Grid: Allowance Rules + Merchant Locks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Allowance Settings Form */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)]">
          <h3 className="font-title-md text-lg font-bold text-[#000f22] mb-6">
            Allowance & Transaction Caps
          </h3>
          <form onSubmit={handleSaveGuardianRules} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                MONTHLY AUTOMATED ALLOWANCE (₹)
              </label>
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
                className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#000f22]"
              />
              <p className="text-[11px] text-[#74777e] mt-1">
                Transferred automatically on the 1st of every month to Student Checking.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                SINGLE TRANSACTION HARD CAP (₹)
              </label>
              <input
                type="number"
                value={maxSingleLimit}
                onChange={(e) => setMaxSingleLimit(e.target.value)}
                className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#000f22]"
              />
              <p className="text-[11px] text-[#74777e] mt-1">
                Any single swipe or transfer exceeding this amount requires Guardian OTP approval.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Save Guardian Controls
            </button>
          </form>
        </div>

        {/* Merchant Category Locks */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] space-y-6">
          <div>
            <h3 className="font-title-md text-lg font-bold text-[#000f22]">Merchant Category Filters</h3>
            <p className="text-xs text-[#74777e]">
              Block or restrict specific vendor types on student physical and virtual cards.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/20">
              <div>
                <p className="text-sm font-bold text-[#000f22]">Gambling & Betting Sites</p>
                <p className="text-xs text-[#74777e]">Strict zero-tolerance block</p>
              </div>
              <button
                onClick={() => toggleLock('gambling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  locks.gambling ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#57fae9] text-[#007168]'
                }`}
              >
                {locks.gambling ? 'LOCKED' : 'UNLOCKED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/20">
              <div>
                <p className="text-sm font-bold text-[#000f22]">Gaming In-App Purchases</p>
                <p className="text-xs text-[#74777e]">Roblox, Steam, PlayStation Store</p>
              </div>
              <button
                onClick={() => toggleLock('gaming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  locks.gaming ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#57fae9] text-[#007168]'
                }`}
              >
                {locks.gaming ? 'LOCKED' : 'UNLOCKED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/20">
              <div>
                <p className="text-sm font-bold text-[#000f22]">International Card E-Commerce</p>
                <p className="text-xs text-[#74777e]">Foreign currency transactions</p>
              </div>
              <button
                onClick={() => toggleLock('international')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  locks.international ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#57fae9] text-[#007168]'
                }`}
              >
                {locks.international ? 'LOCKED' : 'UNLOCKED'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payout Approval Queue */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)]">
        <h3 className="font-title-md text-lg font-bold text-[#000f22] mb-4">
          Pending Chore Reward Payouts Queue
        </h3>
        <div className="space-y-3">
          {chores
            .filter((c) => c.status === 'PENDING_APPROVAL')
            .map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/30"
              >
                <div>
                  <p className="text-sm font-bold text-[#000f22]">{c.title}</p>
                  <p className="text-xs text-[#74777e]">{c.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-[#007168] bg-[#57fae9] px-3 py-1 rounded-full">
                    ₹{c.reward.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => approveChorePayout(c.id)}
                    className="px-4 py-2 bg-[#006a62] hover:bg-[#005049] text-white text-xs font-bold font-mono rounded-xl shadow-xs"
                  >
                    Approve Payout
                  </button>
                </div>
              </div>
            ))}

          {chores.filter((c) => c.status === 'PENDING_APPROVAL').length === 0 && (
            <p className="text-xs text-[#74777e] font-mono py-4 text-center">
              🎉 No pending chore payouts requiring approval.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
