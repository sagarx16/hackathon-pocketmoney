'use client';

import React from 'react';
import { useBank } from '@/context/BankContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBank();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#000f22] text-[#57fae9] border-[#006a62]'
              : toast.type === 'error'
              ? 'bg-[#510009] text-[#ffdad8] border-[#ba1a1a]'
              : 'bg-[#0a2540] text-white border-[#74777e]/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95 ml-2 flex-shrink-0"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
