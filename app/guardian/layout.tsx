import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guardian Portal & Family Controls',
  description: 'Parent-guided financial independence: monitor campus balances, set category limits, and approve allowances on PocketBank.',
  openGraph: {
    title: 'Guardian Portal & Family Controls | PocketBank',
    description: 'Parent-guided financial independence: monitor campus balances, set category limits, and approve allowances on PocketBank.',
  },
};

export default function GuardianLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
