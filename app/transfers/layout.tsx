import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transfers & Instant UPI Payments',
  description: 'Send money instantly via UPI, pay campus friends, and request allowance from parents securely on PocketBank.',
  openGraph: {
    title: 'Transfers & Instant UPI Payments | PocketBank',
    description: 'Send money instantly via UPI, pay campus friends, and request allowance from parents securely on PocketBank.',
  },
};

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
