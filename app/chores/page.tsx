'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function ChoresPage() {
  const { chores, submitChoreForApproval, approveChorePayout, isParentView, addToast } = useBank();

  const [showProofModal, setShowProofModal] = useState<string | null>(null);
  const [proofNote, setProofNote] = useState('');

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showProofModal) return;
    submitChoreForApproval(showProofModal);
    setShowProofModal(null);
    setProofNote('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#000f22]">
            Chores & Reward Payouts
          </h1>
          <p className="text-sm text-[#43474d]">
            Complete assigned academic & household tasks to earn direct allowance payouts from your parent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#007168] bg-[#57fae9] px-3 py-1.5 rounded-full font-bold">
            {isParentView ? 'Parent Reviewer Mode' : 'Student Performer Mode'}
          </span>
        </div>
      </div>

      {/* Chores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chores.map((chore) => {
          return (
            <div
              key={chore.id}
              className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono text-[#007168] bg-[#f1f4f7] px-2.5 py-1 rounded-full font-bold">
                    {chore.category}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-[#007168] bg-[#57fae9] px-3 py-1 rounded-full">
                    +₹{chore.reward.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="font-title-md text-lg font-bold text-[#000f22]">{chore.title}</h3>
                <p className="text-xs text-[#43474d] mt-1">{chore.description}</p>
                <p className="text-[11px] font-mono text-[#74777e] mt-3">Due: {chore.dueDate}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#c4c6ce]/20 flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-md ${
                    chore.status === 'VERIFIED_PAID'
                      ? 'bg-[#57fae9] text-[#007168]'
                      : chore.status === 'PENDING_APPROVAL'
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#ebeef1] text-[#43474d]'
                  }`}
                >
                  {chore.status.replace('_', ' ')}
                </span>

                {isParentView ? (
                  /* Parent Action */
                  <button
                    onClick={() => approveChorePayout(chore.id)}
                    disabled={chore.status === 'VERIFIED_PAID'}
                    className={`px-4 py-2 text-xs font-bold font-mono rounded-xl transition-all ${
                      chore.status === 'VERIFIED_PAID'
                        ? 'bg-[#f1f4f7] text-[#74777e] cursor-not-allowed'
                        : 'bg-[#006a62] hover:bg-[#005049] text-white shadow-md'
                    }`}
                  >
                    {chore.status === 'VERIFIED_PAID' ? 'Payout Approved' : 'Approve & Pay ₹' + chore.reward}
                  </button>
                ) : (
                  /* Student Action */
                  <button
                    onClick={() => {
                      if (chore.status === 'IN_PROGRESS') {
                        setShowProofModal(chore.id);
                      } else {
                        addToast(`Chore status: ${chore.status}`, 'info');
                      }
                    }}
                    disabled={chore.status !== 'IN_PROGRESS'}
                    className={`px-4 py-2 text-xs font-bold font-mono rounded-xl transition-all ${
                      chore.status === 'IN_PROGRESS'
                        ? 'bg-[#000f22] hover:bg-[#0a2540] text-[#57fae9]'
                        : 'bg-[#f1f4f7] text-[#74777e] cursor-not-allowed'
                    }`}
                  >
                    {chore.status === 'IN_PROGRESS'
                      ? 'Submit Proof'
                      : chore.status === 'PENDING_APPROVAL'
                      ? 'Pending Parent Review'
                      : 'Paid & Completed'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6ce]/40">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Submit Chore Proof</h3>
              <button onClick={() => setShowProofModal(null)} className="text-[#74777e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleProofSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">
                  SUBMISSION NOTE / REPORT LINK
                </label>
                <textarea
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Uploaded study room photo or grade report card."
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none h-24"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Send to Parent for Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
