'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function TransfersPage() {
  const { accounts, sendMoney, requestMoney, userProfile } = useBank();

  const [activeTab, setActiveTab] = useState<'SEND' | 'REQUEST'>('SEND');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAcc, setSelectedAcc] = useState(accounts[0].id);
  const [note, setNote] = useState('');

  const quickContacts = [
    { name: userProfile.parentName, upi: 'sandhya.devi@bank', role: 'Guardian', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { name: 'Rohan Sharma', upi: 'rohan.s@okicici', role: 'Batchmate', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Priya Mehta', upi: 'priya.m@upi', role: 'Lab Partner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { name: 'Campus Books Store', upi: 'campusbooks@merchant', role: 'Vendor', avatar: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=150' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!recipient || isNaN(amt) || amt <= 0) return;
    const success = sendMoney(recipient, amt, selectedAcc, note);
    if (success) {
      setRecipient('');
      setAmount('');
      setNote('');
    }
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!recipient || isNaN(amt) || amt <= 0) return;
    requestMoney(recipient, amt, note || 'Allowance Request');
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#000f22]">
          Transfers & P2P Payments
        </h1>
        <p className="text-sm text-[#43474d]">
          Instant UPI payments, friend transfers, and parent allowance requests.
        </p>
      </div>

      {/* Quick Beneficiary Ribbon */}
      <div className="bg-white p-6 rounded-2xl border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)]">
        <h3 className="font-title-md text-sm font-bold text-[#000f22] mb-4">Quick Pay Beneficiaries</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {quickContacts.map((c) => (
            <button
              key={c.upi}
              onClick={() => setRecipient(c.name)}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#f7fafd] hover:bg-[#57fae9]/20 border border-[#c4c6ce]/30 transition-all shrink-0 text-left cursor-pointer group"
            >
              <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-[#000f22] group-hover:text-[#007168]">{c.name}</p>
                <p className="text-[10px] font-mono text-[#74777e]">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Transfer Box */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#c4c6ce]/30 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 bg-[#ebeef1] border-b border-[#c4c6ce]/30">
          <button
            onClick={() => setActiveTab('SEND')}
            className={`py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'SEND' ? 'bg-white text-[#000f22] border-b-2 border-[#006a62]' : 'text-[#74777e]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">send</span>
            <span>Send Money</span>
          </button>
          <button
            onClick={() => setActiveTab('REQUEST')}
            className={`py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'REQUEST' ? 'bg-white text-[#000f22] border-b-2 border-[#006a62]' : 'text-[#74777e]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">request_page</span>
            <span>Request Funds</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          {activeTab === 'SEND' ? (
            <form onSubmit={handleSend} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  SELECT SOURCE ACCOUNT
                </label>
                <select
                  value={selectedAcc}
                  onChange={(e) => setSelectedAcc(e.target.value)}
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm bg-white font-sans text-[#000f22] outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.accountNumber}) - Available: ₹{a.balance.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  RECIPIENT (UPI ID / PHONE / ACCOUNT)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. sandhya.devi@bank or +91 98765 43210"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#000f22]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  TRANSFER AMOUNT (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#000f22]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  PAYMENT NOTE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Lab Manual & Printing Fees"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#000f22]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Authorise & Send Instantly</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequest} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  REQUEST FROM (PARENT / GUARDIAN / FRIEND)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sandhya Devi (Parent)"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#000f22]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  REQUESTED AMOUNT (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[#000f22]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1.5 font-semibold">
                  REASON FOR REQUEST
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Need funds for semester textbook purchase"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#000f22] h-24"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#000f22] hover:bg-[#0a2540] text-[#57fae9] font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Send Request Notification</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
