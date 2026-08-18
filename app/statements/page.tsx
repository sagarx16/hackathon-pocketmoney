'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function StatementsPage() {
  const { transactions, addToast } = useBank();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const categories = ['ALL', 'Education', 'Allowance', 'Food & Dining', 'Reward Payout', 'Transport', 'P2P Transfer'];

  const filtered = transactions.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.account.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const exportStatement = (format: string) => {
    addToast(`Exporting statement in ${format} format... Download started!`, 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#000f22]">
            Transaction Statements
          </h1>
          <p className="text-sm text-[#43474d]">
            Complete real-time audit ledger of all debits, credits, and allowances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStatement('CSV')}
            className="px-4 py-2 bg-white border border-[#c4c6ce] hover:bg-[#f1f4f7] text-[#000f22] text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">csv</span>
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportStatement('PDF')}
            className="px-4 py-2 bg-[#006a62] hover:bg-[#005049] text-white text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>PDF Statement</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e] text-xl">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vendor, title or account..."
              className="w-full bg-[#f7fafd] border border-[#c4c6ce] rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#000f22]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0a2540] text-[#57fae9]'
                    : 'bg-[#f1f4f7] text-[#43474d] hover:bg-[#e5e8eb]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-2xl border border-[#c4c6ce]/30 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7fafd] border-b border-[#c4c6ce]/30 text-[11px] font-mono text-[#74777e] uppercase tracking-wider">
                <th className="py-4 px-6">Transaction</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Account</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c6ce]/20 text-xs font-sans">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#f1f4f7] text-[#0a2540] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{tx.icon}</span>
                      </div>
                      <span className="font-bold text-[#000f22]">{tx.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="bg-[#f1f4f7] text-[#007168] px-2.5 py-1 rounded-full font-bold text-[10px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[#74777e]">{tx.account}</td>
                  <td className="py-4 px-4 font-mono text-[#74777e]">{tx.date}</td>
                  <td className="py-4 px-4">
                    <span className="bg-[#57fae9] text-[#007168] px-2.5 py-1 rounded-full font-mono font-bold text-[10px]">
                      {tx.status}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-right font-mono font-bold text-sm ${
                      tx.type === 'CREDIT' ? 'text-[#007168]' : 'text-[#000f22]'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}₹
                    {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
