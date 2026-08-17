'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function AccountsPage() {
  const { accounts, addToast } = useBank();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(accounts[0].id);
  const [amount, setAmount] = useState('');

  const handleInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    const acc = accounts.find((a) => a.id === selectedAcc);
    addToast(`Successfully deposited ₹${amt.toLocaleString('en-IN')} into ${acc?.name}`, 'success');
    setShowDepositModal(false);
    setAmount('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-f[#000f22]">
            Accounts & Vaults
          </h1>
          <p className="text-sm text-[#43474d]">
            Manage your student checking, high-yield savings, and emergency reserves.
          </p>
        </div>
        <button
          onClick={() => setShowDepositModal(true)}
          className="px-5 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Deposit Funds</span>
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 rounded-xl bg-[#0a2540] text-[#57fae9] material-symbols-outlined text-2xl">
                  {acc.type === 'CHECKING' ? 'account_balance_wallet' : acc.type === 'SAVINGS' ? 'trending_up' : 'lock'}
                </span>
                {acc.apy && (
                  <span className="text-xs font-mono font-bold text-[#007168] bg-[#57fae9] px-2.5 py-1 rounded-full">
                    {acc.apy}
                  </span>
                )}
              </div>
              <h3 className="font-title-md text-lg font-bold text-[#000f22]">{acc.name}</h3>
              <p className="text-xs font-mono text-[#74777e] mt-1">Account No: {acc.accountNumber}</p>
              <div className="mt-6">
                <p className="text-xs font-mono text-[#74777e] uppercase">AVAILABLE BALANCE</p>
                <p className="text-3xl font-extrabold text-[#000f22] font-sans mt-1">
                  ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#c4c6ce]/20 flex items-center justify-between">
              <span className="text-xs font-mono text-[#007168] font-bold">FDIC / RBI Insured</span>
              <button
                onClick={() => addToast(`Statement exported for ${acc.name}`, 'success')}
                className="text-xs font-mono text-[#006a62] hover:underline font-bold flex items-center gap-1"
              >
                <span>Export PDF</span>
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interest Growth Projection Box */}
      <div className="bg-gradient-to-r from-[#0a2540] to-[#000f22] p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#57fae9] bg-[#006a62]/40 px-3 py-1 rounded-full font-bold">
            6.8% HIGH-YIELD STUDENT COMPOUNDING
          </span>
          <h2 className="text-2xl font-bold">Accelerate your savings with zero lock-in</h2>
          <p className="text-sm text-white/70 max-w-xl">
            Keep at least ₹50,000 in your High-Yield Student Savings account to earn up to ₹8,500 annual interest payouts direct to your checking.
          </p>
        </div>
        <button
          onClick={() => addToast('Automated Monthly Sweep enabled!', 'success')}
          className="px-6 py-3 bg-[#57fae9] hover:bg-[#2addcd] text-[#00201d] font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          Enable Auto-Sweep
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6ce]/40">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-lg font-bold text-[#000f22]">Deposit Funds</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-[#74777e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleInternalTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">SELECT TARGET ACCOUNT</label>
                <select
                  value={selectedAcc}
                  onChange={(e) => setSelectedAcc(e.target.value)}
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none bg-white text-[#000f22]"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.accountNumber}) - ₹{a.balance.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1 font-semibold">
                  DEPOSIT AMOUNT (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
