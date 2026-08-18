'use client';

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export default function SavingsPage() {
  const { savingsGoals, depositToGoal, createGoal, addToast } = useBank();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newIcon, setNewIcon] = useState('laptop_mac');

  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTarget);
    if (!newTitle || isNaN(target) || target <= 0) return;
    createGoal(newTitle, target, newDate || '2027', newIcon);
    setShowGoalModal(false);
    setNewTitle('');
    setNewTarget('');
    setNewDate('');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    const success = depositToGoal(depositGoalId, amt);
    if (success) {
      setDepositGoalId(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#000f22]">
            Savings Goals
          </h1>
          <p className="text-sm text-[#43474d]">
            Automated goal tracking with student rewards, streaks, and milestone badges.
          </p>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          className="px-5 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCompleted = pct >= 100;

          return (
            <div
              key={goal.id}
              className="bg-white rounded-2xl p-6 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a2540] text-[#57fae9] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{goal.icon}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-[#57fae9] text-[#007168]'
                        : 'bg-[#f1f4f7] text-[#000f22]'
                    }`}
                  >
                    {isCompleted ? '🎉 GOAL ACHIEVED' : `${pct}% Saved`}
                  </span>
                </div>

                <h3 className="font-title-md text-lg font-bold text-[#000f22]">{goal.title}</h3>
                <p className="text-xs font-mono text-[#74777e] mt-0.5">Target Date: {goal.targetDate}</p>

                {/* Progress bar */}
                <div className="mt-6 space-y-2">
                  <div className="w-full bg-[#e5e8eb] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00d1c1] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-[#000f22]">
                      ₹{goal.currentAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#74777e]">
                      Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#c4c6ce]/20">
                <button
                  onClick={() => setDepositGoalId(goal.id)}
                  disabled={isCompleted}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-[#f1f4f7] text-[#74777e] cursor-not-allowed'
                      : 'bg-[#000f22] hover:bg-[#0a2540] text-[#57fae9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>{isCompleted ? 'Completed' : 'Add Deposit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6ce]/40">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-lg font-bold text-[#000f22]">Create Savings Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-[#74777e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">GOAL TITLE</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. New iPhone or Gaming Rig"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">TARGET AMOUNT (₹)</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">TARGET DATE</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. Oct 2026"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm font-mono outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#c4c6ce]/40">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Deposit to Goal</h3>
              <button onClick={() => setDepositGoalId(null)} className="text-[#74777e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474d] mb-1">AMOUNT TO DEPOSIT (₹)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full border border-[#c4c6ce] rounded-xl px-4 py-2.5 text-sm font-mono outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Transfer to Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
