'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  icon: string;
  account: string;
}

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  apy?: string;
  type: 'CHECKING' | 'SAVINGS' | 'VAULT';
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
  category: string;
}

export interface Chore {
  id: string;
  title: string;
  reward: number;
  status: 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'VERIFIED_PAID';
  category: string;
  dueDate: string;
  description: string;
}

export interface CardInfo {
  id: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholder: string;
  isFrozen: boolean;
  dailyLimit: number;
  usedToday: number;
  type: 'PHYSICAL' | 'VIRTUAL';
  colorGradient: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface BankContextType {
  // Mode & Auth
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  isParentView: boolean;
  toggleParentView: () => void;

  // Student Profile
  userProfile: {
    name: string;
    studentId: string;
    avatar: string;
    email: string;
    kycStatus: string;
    rewardPoints: number;
    parentName: string;
  };

  // State
  accounts: Account[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  chores: Chore[];
  cards: CardInfo[];
  toasts: Toast[];

  // Actions
  sendMoney: (recipient: string, amount: number, accountId: string, note?: string) => boolean;
  requestMoney: (from: string, amount: number, reason: string) => void;
  depositToGoal: (goalId: string, amount: number) => boolean;
  createGoal: (title: string, targetAmount: number, targetDate: string, icon: string) => void;
  toggleCardFreeze: (cardId: string) => void;
  updateCardLimit: (cardId: string, limit: number) => void;
  submitChoreForApproval: (choreId: string) => void;
  approveChorePayout: (choreId: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isParentView, setIsParentView] = useState(false);

  const [userProfile] = useState({
    name: 'Sagar Pathak',
    studentId: 'STU-2026-8942',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    email: 'sagarixa@gmail.com',
    kycStatus: 'Verified Student',
    rewardPoints: 1450,
    parentName: 'Sandhya Devi',
  });

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'acc-1',
      name: 'Primary Checking',
      accountNumber: '•••• 4892',
      balance: 42850.5,
      type: 'CHECKING',
    },
    {
      id: 'acc-2',
      name: 'High-Yield Student Savings',
      accountNumber: '•••• 9012',
      balance: 125000.0,
      apy: '6.8% APY',
      type: 'SAVINGS',
    },
    {
      id: 'acc-3',
      name: 'Emergency Vault',
      accountNumber: '•••• 3341',
      balance: 15000.0,
      apy: '7.2% APY',
      type: 'VAULT',
    },
  ]);

  const [cards, setCards] = useState<CardInfo[]>([
    {
      id: 'card-1',
      cardName: 'PocketBank Student Visa',
      cardNumber: '4532 •••• •••• 8821',
      expiry: '08/28',
      cvv: '392',
      cardholder: 'SAGAR PATHAK',
      isFrozen: false,
      dailyLimit: 10000,
      usedToday: 2450,
      type: 'PHYSICAL',
      colorGradient: 'from-[#0a2540] via-[#000f22] to-[#006a62]',
    },
    {
      id: 'card-2',
      cardName: 'Virtual Online Pass Card',
      cardNumber: '5412 •••• •••• 1092',
      expiry: '11/27',
      cvv: '814',
      cardholder: 'SAGAR PATHAK (ONLINE)',
      isFrozen: false,
      dailyLimit: 5000,
      usedToday: 500,
      type: 'VIRTUAL',
      colorGradient: 'from-[#006a62] via-[#007168] to-[#57fae9]',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      title: 'Campus Central Bookstore',
      category: 'Education',
      amount: 1240.0,
      type: 'DEBIT',
      date: 'Today, 2:15 PM',
      status: 'COMPLETED',
      icon: 'menu_book',
      account: 'Primary Checking',
    },
    {
      id: 'tx-2',
      title: 'Allowance Payout from Guardian',
      category: 'Allowance',
      amount: 5000.0,
      type: 'CREDIT',
      date: 'Yesterday',
      status: 'COMPLETED',
      icon: 'payments',
      account: 'Primary Checking',
    },
    {
      id: 'tx-3',
      title: 'Artisan Coffee House',
      category: 'Food & Dining',
      amount: 240.0,
      type: 'DEBIT',
      date: 'Yesterday',
      status: 'COMPLETED',
      icon: 'local_cafe',
      account: 'Primary Checking',
    },
    {
      id: 'tx-4',
      title: 'Chore Reward: Straight As Midterm',
      category: 'Reward Payout',
      amount: 2000.0,
      type: 'CREDIT',
      date: '11 Aug 2026',
      status: 'COMPLETED',
      icon: 'emoji_events',
      account: 'High-Yield Savings',
    },
    {
      id: 'tx-5',
      title: 'Student Metro Travel Card',
      category: 'Transport',
      amount: 600.0,
      type: 'DEBIT',
      date: '10 Aug 2026',
      status: 'COMPLETED',
      icon: 'directions_subway',
      account: 'Primary Checking',
    },
    {
      id: 'tx-6',
      title: 'Transfer to Rohan (Lab Notes)',
      category: 'P2P Transfer',
      amount: 350.0,
      type: 'DEBIT',
      date: '09 Aug 2026',
      status: 'COMPLETED',
      icon: 'send',
      account: 'Primary Checking',
    },
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: 'goal-1',
      title: 'MacBook Pro M3 Fund',
      targetAmount: 120000,
      currentAmount: 84000,
      targetDate: 'Dec 2026',
      icon: 'laptop_mac',
      color: '#00d1c1',
      category: 'Electronics',
    },
    {
      id: 'goal-2',
      title: 'Goa Summer Trip with Batchmates',
      targetAmount: 25000,
      currentAmount: 18500,
      targetDate: 'May 2027',
      icon: 'flight_takeoff',
      color: '#0a2540',
      category: 'Travel',
    },
    {
      id: 'goal-3',
      title: 'Emergency Tech & Accessories',
      targetAmount: 15000,
      currentAmount: 15000,
      targetDate: 'Completed',
      icon: 'build',
      color: '#ff6b6b',
      category: 'Emergency',
    },
  ]);

  const [chores, setChores] = useState<Chore[]>([
    {
      id: 'chore-1',
      title: 'Maintain 8.5+ GPA in Midterms',
      reward: 2000,
      status: 'VERIFIED_PAID',
      category: 'Academics',
      dueDate: 'Completed',
      description: 'Submit midterm official grade card report.',
    },
    {
      id: 'chore-2',
      title: 'Clean & Organize Study Room',
      reward: 500,
      status: 'PENDING_APPROVAL',
      category: 'Home',
      dueDate: 'Today',
      description: 'Upload clean room proof photo for verification.',
    },
    {
      id: 'chore-3',
      title: 'Complete 15 Hours Community Service',
      reward: 1500,
      status: 'IN_PROGRESS',
      category: 'Service',
      dueDate: '2 days left',
      description: 'Volunteer at community library or blood drive.',
    },
    {
      id: 'chore-4',
      title: 'Weekly Budget & Savings Audit',
      reward: 300,
      status: 'IN_PROGRESS',
      category: 'Finance',
      dueDate: 'Sunday',
      description: 'Log all expenses accurately in PocketBank for 7 days.',
    },
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 2000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d1c1', '#0a2540', '#ff6b6b', '#57fae9'],
      });
    } catch {
      // fallback if canvas canvas-confetti fails
    }
  };

  const sendMoney = (recipient: string, amount: number, accountId: string, note?: string) => {
    const sourceAcc = accounts.find((a) => a.id === accountId || a.name === accountId);
    if (!sourceAcc) {
      addToast('Invalid account selected', 'error');
      return false;
    }
    if (sourceAcc.balance < amount) {
      addToast('Insufficient funds in selected account', 'error');
      return false;
    }

    // Deduct
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc))
    );

    // Add transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Transfer to ${recipient}${note ? ` (${note})` : ''}`,
      category: 'Transfer',
      amount,
      type: 'DEBIT',
      date: 'Just now',
      status: 'COMPLETED',
      icon: 'send',
      account: sourceAcc.name,
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast(`Successfully sent ₹${amount.toLocaleString('en-IN')} to ${recipient}`, 'success');
    triggerConfetti();
    return true;
  };

  const requestMoney = (from: string, amount: number, reason: string) => {
    addToast(`Request of ₹${amount.toLocaleString('en-IN')} sent to ${from} (${reason})`, 'info');
  };

  const depositToGoal = (goalId: string, amount: number) => {
    const primaryAcc = accounts[0];
    if (primaryAcc.balance < amount) {
      addToast('Insufficient funds in Primary Checking to transfer to savings goal', 'error');
      return false;
    }

    // Deduct from checking
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === primaryAcc.id ? { ...acc, balance: acc.balance - amount } : acc))
    );

    // Add to savings goal
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = g.currentAmount + amount;
          if (updated >= g.targetAmount) {
            triggerConfetti();
            addToast(`🎉 Savings Goal "${g.title}" Achieved!`, 'success');
          } else {
            addToast(`Deposited ₹${amount.toLocaleString('en-IN')} into "${g.title}"`, 'success');
          }
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );

    return true;
  };

  const createGoal = (title: string, targetAmount: number, targetDate: string, icon: string) => {
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title,
      targetAmount,
      currentAmount: 0,
      targetDate,
      icon: icon || 'savings',
      color: '#00d1c1',
      category: 'Personal',
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    addToast(`New goal "${title}" created!`, 'success');
  };

  const toggleCardFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.isFrozen;
          addToast(`Card ${c.cardNumber} ${nextState ? 'Frozen' : 'Unfrozen'} successfully`, nextState ? 'info' : 'success');
          return { ...c, isFrozen: nextState };
        }
        return c;
      })
    );
  };

  const updateCardLimit = (cardId: string, limit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, dailyLimit: limit } : c))
    );
    addToast(`Daily transaction limit set to ₹${limit.toLocaleString('en-IN')}`, 'success');
  };

  const submitChoreForApproval = (choreId: string) => {
    setChores((prev) =>
      prev.map((ch) => {
        if (ch.id === choreId) {
          addToast(`Chore "${ch.title}" submitted for Parent Approval!`, 'info');
          return { ...ch, status: 'PENDING_APPROVAL' };
        }
        return ch;
      })
    );
  };

  const approveChorePayout = (choreId: string) => {
    const chore = chores.find((ch) => ch.id === choreId);
    if (!chore) return;

    setChores((prev) =>
      prev.map((ch) => (ch.id === choreId ? { ...ch, status: 'VERIFIED_PAID' } : ch))
    );

    // Add funds to student checking
    setAccounts((prev) =>
      prev.map((acc, idx) => (idx === 0 ? { ...acc, balance: acc.balance + chore.reward } : acc))
    );

    // Add transaction record
    const rewardTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Chore Payout Approved: ${chore.title}`,
      category: 'Reward Payout',
      amount: chore.reward,
      type: 'CREDIT',
      date: 'Just now',
      status: 'COMPLETED',
      icon: 'emoji_events',
      account: 'Primary Checking',
    };
    setTransactions((prev) => [rewardTx, ...prev]);

    triggerConfetti();
    addToast(`Approved payout of ₹${chore.reward.toLocaleString('en-IN')} for "${chore.title}"`, 'success');
  };

  return (
    <BankContext.Provider
      value={{
        isLoggedIn,
        login: () => setIsLoggedIn(true),
        logout: () => setIsLoggedIn(false),
        isParentView,
        toggleParentView: () => setIsParentView(!isParentView),
        userProfile,
        accounts,
        transactions,
        savingsGoals,
        chores,
        cards,
        toasts,
        sendMoney,
        requestMoney,
        depositToGoal,
        createGoal,
        toggleCardFreeze,
        updateCardLimit,
        submitChoreForApproval,
        approveChorePayout,
        addToast,
        removeToast,
        triggerConfetti,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
