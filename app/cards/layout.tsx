import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sovereign Student Cards & NFC Pass',
  description: 'Control your virtual and physical student debit cards, freeze cards in 1 tap, and manage NFC contactless payments.',
  openGraph: {
    title: 'Sovereign Student Cards & NFC Pass | PocketBank',
    description: 'Control your virtual and physical student debit cards, freeze cards in 1 tap, and manage NFC contactless payments.',
  },
};

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
