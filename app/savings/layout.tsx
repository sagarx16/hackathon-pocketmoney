import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Savings Goals & High-Yield Vaults',
  description: 'Create automated student savings goals, track roundups, and earn competitive yields on PocketBank.',
  openGraph: {
    title: 'Smart Savings Goals & High-Yield Vaults | PocketBank',
    description: 'Create automated student savings goals, track roundups, and earn competitive yields on PocketBank.',
  },
};

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
