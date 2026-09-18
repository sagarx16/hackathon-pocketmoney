import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts & Campus Wallets',
  description: 'Manage checking accounts, emergency vaults, and campus spending wallets on PocketBank.',
  openGraph: {
    title: 'Accounts & Campus Wallets | PocketBank',
    description: 'Manage checking accounts, emergency vaults, and campus spending wallets on PocketBank.',
  },
};

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
