import type { Metadata } from 'next';
import './globals.css';
import { BankProvider } from '@/context/BankContext';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'PocketBank - Student Fintech Platform',
  description: 'A sophisticated, modern digital banking app for students, featuring smart savings, chore rewards, P2P payments, and parent controls.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Material Symbols — loaded via <link> for reliable rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#f7fafd] text-[#181c1e] antialiased selection:bg-[#57fae9] selection:text-[#007168]">
        <BankProvider>
          <MainLayout>{children}</MainLayout>
        </BankProvider>
      </body>
    </html>
  );
}
