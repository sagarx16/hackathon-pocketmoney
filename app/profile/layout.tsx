import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile & Account Security',
  description: 'Manage your verified student credentials, connected UPI accounts, KYC verification, and biometric security settings.',
  openGraph: {
    title: 'Profile & Account Security | PocketBank',
    description: 'Manage your verified student credentials, connected UPI accounts, KYC verification, and biometric security settings.',
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
