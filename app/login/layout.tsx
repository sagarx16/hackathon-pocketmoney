import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In & Access Student Portal',
  description: 'Sign in securely to your PocketBank account with Clerk biometric and passkey authentication.',
  openGraph: {
    title: 'Sign In | PocketBank',
    description: 'Sign in securely to your PocketBank account with Clerk biometric and passkey authentication.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
