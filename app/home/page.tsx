'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBank } from '@/context/BankContext';

export default function DashboardPage() {
  const {
    userProfile,
    accounts,
    transactions,
    savingsGoals,
    cards,
    chores,
    sendMoney,
    toggleCardFreeze,
    depositToGoal,
    isParentView,
    addToast,
  } = useBank();

  // Quick Transfer State
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalRecipient, setModalRecipient] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalNote, setModalNote] = useState('');

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const handleQuickTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!transferRecipient || isNaN(amt) || amt <= 0) {
      addToast('Please enter a valid recipient and amount', 'error');
      return;
    }
    const success = sendMoney(transferRecipient, amt, accounts[0].id);
    if (success) {
      setTransferRecipient('');
      setTransferAmount('');
    }
  };

  const handleModalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(modalAmount);
    if (!modalRecipient || isNaN(amt) || amt <= 0) {
      addToast('Please enter a valid recipient and amount', 'error');
      return;
    }
    const success = sendMoney(modalRecipient, amt, accounts[0].id, modalNote);
    if (success) {
      setShowTransferModal(false);
      setModalRecipient('');
      setModalAmount('');
      setModalNote('');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0a2540] via-[#000f22] to-[#006a62] p-6 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#57fae9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#57fae9]">
            <span className="w-2 h-2 rounded-full bg-[#57fae9] animate-pulse" />
            <span>GURU GOVIND INSTITUTIONAL BANKING</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-sans">
            Welcome back, {userProfile.name}
          </h1>
          <p className="text-sm text-white/70">
            {isParentView
              ? 'Parent Mode active. Reviewing student spending & allowance.'
              : 'Your student accounts are operating cleanly with zero hidden fees.'}
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-5 py-2.5 bg-[#00d1c1] hover:bg-[#00b0a3] text-[#00201d] font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            <span>Send Money</span>
          </button>
          <Link
            href="/savings"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">savings</span>
            <span>Add Goal</span>
          </Link>
        </div>
      </div>

      {/* Grid Row 1: Balance Card + Quick Actions & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Net Worth Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="font-mono text-xs text-[#74777e] uppercase tracking-wider font-semibold">
                TOTAL COMBINED NET WORTH
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl md:text-4xl font-extrabold text-[#000f22] font-sans">
                  ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-mono font-bold text-[#007168] bg-[#57fae9] px-2 py-0.5 rounded-md">
                  +4.2% this month
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-3xl text-[#0a2540]">account_balance</span>
          </div>

          {/* Account List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#c4c6ce]/30">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/30 hover:border-[#0a2540]/40 transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#000f22] truncate">{acc.name}</span>
                  {acc.apy && (
                    <span className="text-[10px] font-mono text-[#007168] font-bold">{acc.apy}</span>
                  )}
                </div>
                <p className="font-mono text-xs text-[#74777e]">{acc.accountNumber}</p>
                <p className="text-base font-bold text-[#000f22] mt-2">
                  ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Send Widget */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a62]">flash_on</span>
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Instant P2P Transfer</h3>
            </div>
            <form onSubmit={handleQuickTransfer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#43474d] mb-1">
                  RECIPIENT (PHONE / UPI ID / FRIEND)
                </label>
                <input
                  type="text"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  placeholder="e.g. rohan@upi or +91 98765..."
                  className="w-full bg-[#f7fafd] border border-[#c4c6ce] rounded-xl px-3.5 py-2.5 text-xs text-[#000f22] focus:border-[#000f22] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#43474d] mb-1">AMOUNT (₹)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-[#f7fafd] border border-[#c4c6ce] rounded-xl px-3.5 py-2.5 text-xs text-[#000f22] focus:border-[#000f22] outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#000f22] hover:bg-[#0a2540] text-[#57fae9] font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Send Money Instantly</span>
              </button>
            </form>
          </div>
          <p className="text-[11px] text-[#74777e] text-center mt-4">
            Protected by PocketBank 256-bit Student Security
          </p>
        </div>
      </div>

      {/* Grid Row 2: Cards Widget + Savings Goals + Chores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Preview Widget */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-md text-base font-bold text-[#000f22]">Active Cards</h3>
            <Link href="/cards" className="text-xs font-mono text-[#006a62] font-bold hover:underline">
              Manage Cards
            </Link>
          </div>
          {cards.slice(0, 1).map((card) => (
            <div key={card.id} className="space-y-4">
              <div
                className={`p-5 rounded-2xl bg-gradient-to-r ${card.colorGradient} text-white shadow-lg relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-mono text-[#57fae9]">{card.cardName}</p>
                    <p className="text-sm font-bold tracking-widest font-mono mt-1">
                      {card.cardNumber}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-[#57fae9]">
                    credit_card
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-mono text-white/60">CARDHOLDER</p>
                    <p className="text-xs font-bold font-mono">{card.cardholder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-white/60">EXPIRES</p>
                    <p className="text-xs font-bold font-mono">{card.expiry}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleCardFreeze(card.id)}
                className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  card.isFrozen
                    ? 'bg-[#ea5c5d] text-white border-[#ea5c5d]'
                    : 'border-[#c4c6ce] text-[#000f22] hover:bg-[#f1f4f7]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {card.isFrozen ? 'lock_open' : 'lock'}
                </span>
                <span>{card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Savings Goals Summary */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Savings Tracker</h3>
              <Link href="/savings" className="text-xs font-mono text-[#006a62] font-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {savingsGoals.slice(0, 2).map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="p-3 bg-[#f7fafd] rounded-xl border border-[#c4c6ce]/20">
                    <div className="flex justify-between text-xs font-bold text-[#000f22] mb-1">
                      <span>{goal.title}</span>
                      <span className="font-mono text-[#007168]">{pct}%</span>
                    </div>
                    <div className="w-full bg-[#e5e8eb] h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-[#00d1c1] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#74777e] font-mono">
                      <span>₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                      <span>Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => depositToGoal(savingsGoals[0].id, 1000)}
            className="w-full mt-4 py-2.5 bg-[#f1f4f7] hover:bg-[#e5e8eb] text-[#000f22] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Deposit ₹1,000 to MacBook Goal</span>
          </button>
        </div>

        {/* Chores & Allowance Widget */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Active Chores & Tasks</h3>
              <Link href="/chores" className="text-xs font-mono text-[#006a62] font-bold hover:underline">
                View Chores
              </Link>
            </div>
            <div className="space-y-3">
              {chores.slice(0, 2).map((chore) => (
                <div
                  key={chore.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f7fafd] border border-[#c4c6ce]/20"
                >
                  <div>
                    <p className="text-xs font-bold text-[#000f22] line-clamp-1">{chore.title}</p>
                    <span className="text-[10px] font-mono text-[#007168] bg-[#57fae9] px-2 py-0.5 rounded-full font-bold">
                      ₹{chore.reward.toLocaleString('en-IN')} Reward
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md ${
                      chore.status === 'VERIFIED_PAID'
                        ? 'bg-[#57fae9] text-[#007168]'
                        : chore.status === 'PENDING_APPROVAL'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#ebeef1] text-[#43474d]'
                    }`}
                  >
                    {chore.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/chores"
            className="w-full mt-4 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-xs rounded-xl text-center transition-all block"
          >
            Submit Chore Proof
          </Link>
        </div>
      </div>

      {/* Grid Row 3: Recent Transactions Audit Feed */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-title-md text-lg font-bold text-[#000f22]">Recent Financial Activity</h3>
            <p className="text-xs text-[#74777e]">Live ledger statement for Primary Student Account</p>
          </div>
          <Link
            href="/statements"
            className="px-4 py-2 bg-[#f1f4f7] hover:bg-[#e5e8eb] text-[#000f22] text-xs font-bold font-mono rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>Full Statement</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="divide-y divide-[#c4c6ce]/20">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between hover:bg-[#f7fafd] px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#f1f4f7] text-[#0a2540] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{tx.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#000f22]">{tx.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-[#74777e]">{tx.date}</span>
                    <span className="text-[10px] font-mono text-[#007168] bg-[#f1f4f7] px-2 py-0.2 rounded-full">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold font-mono ${
                    tx.type === 'CREDIT' ? 'text-[#007168]' : 'text-[#000f22]'
                  }`}
                >
                  {tx.type === 'CREDIT' ? '+' : '-'}₹
                  {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] font-mono text-[#74777e]">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6ce]/40 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-lg font-bold text-[#000f22]">Send Money</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-[#74777e] hover:text-[#000f22]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleModalTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">RECIPIENT NAME / UPI ID</label>
                <input
                  type="text"
                  value={modalRecipient}
                  onChange={(e) => setModalRecipient(e.target.value)}
                  placeholder="e.g. Sandhya Devi (Parent) or friend@upi"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#000f22]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">AMOUNT (₹)</label>
                <input
                  type="number"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-[#000f22]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">PURPOSE / NOTE (OPTIONAL)</label>
                <input
                  type="text"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="e.g. Books & Stationary"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#000f22]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Confirm Transfer</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
