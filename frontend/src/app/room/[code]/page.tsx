import type { Metadata } from 'next';
import RoomPageClient from './RoomPageClient';

export const metadata: Metadata = {
  title: 'Room | Planning Poker',
  description: 'Estimate user stories in real time with your team.',
};

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { code } = await params;
  return <RoomPageClient code={code} />;
}
