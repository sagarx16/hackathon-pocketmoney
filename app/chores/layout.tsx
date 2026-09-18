import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chore Rewards & Academic Milestones',
  description: 'Complete household chores and academic milestones to earn cash rewards and badges on PocketBank.',
  openGraph: {
    title: 'Chore Rewards & Academic Milestones | PocketBank',
    description: 'Complete household chores and academic milestones to earn cash rewards and badges on PocketBank.',
  },
};

export default function ChoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
