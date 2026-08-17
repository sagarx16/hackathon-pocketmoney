'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBank } from '@/context/BankContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useBank();

  const [username, setUsername] = useState('sagar.pathak');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [otp, setOtp] = useState(['4', '8', '9', '2', '0', '1']);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please enter your username and password', 'error');
      return;
    }
    setStep('OTP');
    addToast('OTP sent to registered mobile number +91 ***** 43210', 'info');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    addToast('🎉 Login successful! Welcome back, Sagar.', 'success');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f7fafd] relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#57fae9]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-[#d2e4ff]/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Header logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0a2540] text-[#57fae9] mb-4 shadow-lg ring-4 ring-[#57fae9]/20">
            <span className="material-symbols-outlined text-4xl">account_balance</span>
          </div>
          <h1 className="font-headline-lg text-3xl font-bold text-[#000f22] mb-1">PocketBank</h1>
          <p className="text-[#43474d] text-sm font-medium">Student Fintech Platform</p>
        </div>

        {/* Login Step */}
        {step === 'LOGIN' ? (
          <div className="bg-white rounded-2xl shadow-xl border border-[#c4c6ce]/30 p-8">
            <h2 className="font-title-md text-xl font-bold text-[#000f22] mb-6">Welcome back</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-xs text-[#43474d] mb-2 font-semibold tracking-wider">
                  USERNAME OR STUDENT ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74777e] text-xl">
                    person
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border border-[#c4c6ce] rounded-xl py-3 pl-12 pr-4 text-[#000f22] text-sm focus:border-[#000f22] focus:ring-1 focus:ring-[#000f22] outline-none transition-all"
                    placeholder="e.g. sagar.pathak"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-mono text-xs text-[#43474d] font-semibold tracking-wider">
                    PASSWORD
                  </label>
                  <a href="#" className="font-mono text-xs text-[#006a62] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74777e] text-xl">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#c4c6ce] rounded-xl py-3 pl-12 pr-12 text-[#000f22] text-sm focus:border-[#000f22] focus:ring-1 focus:ring-[#000f22] outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777e] hover:text-[#000f22]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                <span>Continue with 2FA</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-[#c4c6ce]/30">
              <p className="text-xs text-[#43474d]">
                Don&apos;t have a PocketBank account?{' '}
                <a href="#" className="font-bold text-[#006a62] hover:underline">
                  Apply via Campus Partner
                </a>
              </p>
            </div>
          </div>
        ) : (
          /* 2FA OTP Step */
          <div className="bg-white rounded-2xl shadow-xl border border-[#c4c6ce]/30 p-8">
            <button
              onClick={() => setStep('LOGIN')}
              className="flex items-center gap-1 text-xs text-[#74777e] hover:text-[#000f22] mb-4 font-mono"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <h2 className="font-title-md text-xl font-bold text-[#000f22] mb-1">Verify Security Code</h2>
            <p className="text-xs text-[#43474d] mb-6">
              Enter the 6-digit OTP sent to your registered student phone.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold font-mono border-2 border-[#c4c6ce] focus:border-[#007168] rounded-xl outline-none bg-[#f1f4f7]"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#000f22] hover:bg-[#0a2540] text-[#57fae9] font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span>Confirm & Sign In</span>
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => addToast('Resent OTP to phone', 'info')}
                className="text-xs font-mono text-[#006a62] hover:underline"
              >
                Didn&apos;t receive code? Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
