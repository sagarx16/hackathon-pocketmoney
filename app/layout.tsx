import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { BankProvider } from '@/context/BankContext';
import { MainLayout } from '@/components/layout/MainLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pocketbank.vercel.app'),
  title: {
    default: 'PocketBank - Student Fintech Platform',
    template: '%s | PocketBank',
  },
  description: 'A sophisticated, modern digital banking app for students, featuring smart savings, chore rewards, P2P payments, and parent controls.',
  keywords: ['student banking', 'fintech', 'pocket money', 'smart savings', 'P2P transfers', 'guardian controls', 'UPI'],
  authors: [{ name: 'PocketBank Team' }],
  creator: 'PocketBank',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pocketbank.vercel.app',
    siteName: 'PocketBank',
    title: 'PocketBank - Student Fintech Platform',
    description: 'Empowering students with smart savings, instant UPI transfers, chore rewards, and parent-guided financial freedom.',
    images: [
      {
        url: '/alpha.avif',
        width: 1200,
        height: 630,
        alt: 'PocketBank Student Fintech Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PocketBank - Student Fintech Platform',
    description: 'Empowering students with smart savings, instant UPI transfers, chore rewards, and parent-guided financial freedom.',
    images: ['/alpha.avif'],
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.webp', type: 'image/webp' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon-32.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetbrainsMono.variable} light`}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        {/* Material Symbols — preconnect & preload hints with display=swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-[#f7fafd] text-[#181c1e] antialiased selection:bg-[#57fae9] selection:text-[#007168]">
        <ClerkProvider
          appearance={{
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
        >
          <BankProvider>
          <MainLayout>{children}</MainLayout>
          </BankProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}