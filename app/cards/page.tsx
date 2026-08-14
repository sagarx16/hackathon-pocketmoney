'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '@/context/BankContext';

export default function CardsPage() {
  const { cards, toggleCardFreeze, updateCardLimit, addToast } = useBank();
  const [selectedCardId, setSelectedCardId] = useState(cards[0].id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [sliderValue, setSliderValue] = useState(cards[0].dailyLimit);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  // Sync slider value when card changes
  useEffect(() => {
    setSliderValue(currentCard.dailyLimit);
  }, [selectedCardId, currentCard.dailyLimit]);

  // Handle debounced slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);

    // Clear existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounced timeout (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      updateCardLimit(currentCard.id, newValue);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.join('').length < 4) {
      addToast('Please enter a 4-digit PIN', 'error');
      return;
    }
    addToast(`Security PIN for ${currentCard.cardName} updated successfully!`, 'success');
    setShowPinModal(false);
    setNewPin(['', '', '', '']);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#000f22]">
            Card Management
          </h1>
          <p className="text-sm text-[#43474d]">
            Control physical debit cards, virtual online pass cards, spending limits, and security locks.
          </p>
        </div>
        <button
          onClick={() => addToast('New Virtual Student Card issued!', 'success')}
          className="px-5 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_card</span>
          <span>Issue Virtual Card</span>
        </button>
      </div>

      {/* Grid: 3D Interactive Card Display + Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive Card Preview */}
        <div className="space-y-6">
          {/* Card Selector Tabs */}
          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-[#c4c6ce]/30 shadow-xs">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCardId(c.id);
                  setIsFlipped(false);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCardId === c.id
                    ? 'bg-[#0a2540] text-[#57fae9] shadow-sm'
                    : 'text-[#43474d] hover:bg-[#f1f4f7]'
                }`}
              >
                {c.cardName}
              </button>
            ))}
          </div>

          {/* 3D Flip Card Container */}
          <div className="relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div
              className={`w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br ${currentCard.colorGradient} p-8 text-white shadow-2xl relative flex flex-col justify-between transition-transform duration-500 transform-gpu ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {!isFlipped ? (
                /* Front Side */
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono text-[#57fae9] font-bold">POCKETBANK STUDENT</p>
                      <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {currentCard.type}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-[#57fae9]">
                      contactless
                    </span>
                  </div>

                  <div className="my-auto">
                    <p className="text-2xl md:text-3xl font-mono tracking-widest font-bold">
                      {currentCard.cardNumber}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-white/60">CARDHOLDER</p>
                      <p className="text-sm font-bold font-mono uppercase">{currentCard.cardholder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-white/60">EXPIRES</p>
                      <p className="text-sm font-bold font-mono">{currentCard.expiry}</p>
                    </div>
                  </div>
                </>
              ) : (
                /* Back Side */
                <div className="rotate-y-180 h-full flex flex-col justify-between">
                  <div className="w-full h-12 bg-black/80 -mx-8 mt-2" />
                  <div className="bg-white/20 p-3 rounded-lg flex justify-between items-center font-mono">
                    <span className="text-xs text-white/70">CVV SECURITY</span>
                    <span className="font-bold text-lg tracking-widest text-[#57fae9]">
                      {currentCard.cvv}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/60 text-center">
                    Authorized student cardholder signature required.
                  </p>
                </div>
              )}
            </div>
            <p className="text-center text-xs font-mono text-[#74777e] mt-3">
              💡 Click card to flip and view CVV security code
            </p>
          </div>
        </div>

        {/* Right Column: Card Controls & Limits */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#c4c6ce]/30 shadow-[0px_4px_20px_rgba(10,37,64,0.05)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30">
            <div>
              <h3 className="font-title-md text-lg font-bold text-[#000f22]">{currentCard.cardName}</h3>
              <p className="text-xs font-mono text-[#74777e]">Status: {currentCard.isFrozen ? 'FROZEN / LOCKED' : 'ACTIVE'}</p>
            </div>
            <button
              onClick={() => toggleCardFreeze(currentCard.id)}
              className={`px-4 py-2 text-xs font-bold font-mono rounded-xl border transition-all flex items-center gap-2 ${
                currentCard.isFrozen
                  ? 'bg-[#ea5c5d] text-white border-[#ea5c5d]'
                  : 'bg-[#57fae9] text-[#007168] border-[#006a62]'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {currentCard.isFrozen ? 'lock_open' : 'lock'}
              </span>
              <span>{currentCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-[#000f22]">
              <span>Daily Transaction Limit</span>
              <span className="font-mono text-[#007168]">
                ₹{sliderValue.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full accent-[#006a62] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#74777e]">
              <span>Min: ₹1,000</span>
              <span>Max: ₹50,000</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#c4c6ce]/20">
            <button
              onClick={() => setShowPinModal(true)}
              className="p-4 rounded-xl bg-[#f7fafd] hover:bg-[#ebeef1] border border-[#c4c6ce]/30 text-left transition-all group"
            >
              <span className="material-symbols-outlined text-2xl text-[#0a2540] group-hover:scale-110 transition-transform">
                pin
              </span>
              <p className="text-xs font-bold text-[#000f22] mt-2">Change Card PIN</p>
              <p className="text-[10px] text-[#74777e]">Reset 4-digit ATM PIN</p>
            </button>
            <button
              onClick={() => addToast('Contactless NFC toggle updated', 'success')}
              className="p-4 rounded-xl bg-[#f7fafd] hover:bg-[#ebeef1] border border-[#c4c6ce]/30 text-left transition-all group"
            >
              <span className="material-symbols-outlined text-2xl text-[#006a62] group-hover:scale-110 transition-transform">
                wifi_tethering
              </span>
              <p className="text-xs font-bold text-[#000f22] mt-2">Contactless Tap</p>
              <p className="text-[10px] text-[#74777e]">Enable / Disable NFC</p>
            </button>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-[#000f22]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#c4c6ce]/40">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c6ce]/30 mb-4">
              <h3 className="font-title-md text-base font-bold text-[#000f22]">Reset Card PIN</h3>
              <button onClick={() => setShowPinModal(false)} className="text-[#74777e]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {newPin.map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const updated = [...newPin];
                      updated[idx] = e.target.value;
                      setNewPin(updated);
                    }}
                    className="w-12 h-12 text-center text-xl font-bold font-mono border-2 border-[#c4c6ce] focus:border-[#007168] rounded-xl outline-none bg-[#f1f4f7]"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Set New PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
