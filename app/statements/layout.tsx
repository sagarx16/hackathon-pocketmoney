import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Statements & Tax Ledger',
  description: 'Download monthly student financial statements, category expenditure reports, and audit certificates on PocketBank.',
  openGraph: {
    title: 'Financial Statements & Tax Ledger | PocketBank',
    description: 'Download monthly student financial statements, category expenditure reports, and audit certificates on PocketBank.',
  },
};

export default function StatementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
