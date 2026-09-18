import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard & Student Ledger',
  description: 'View your live balance, recent transactions, quick actions, and financial pulse on PocketBank.',
  openGraph: {
    title: 'Dashboard & Student Ledger | PocketBank',
    description: 'View your live balance, recent transactions, quick actions, and financial pulse on PocketBank.',
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
