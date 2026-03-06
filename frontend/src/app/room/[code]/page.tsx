import type { Metadata } from 'next';
import RoomPageClient from './RoomPageClient';

export const metadata: Metadata = {
  title: 'Sala | Planning Poker',
  description: 'Estima historias de usuario en tiempo real con tu equipo.',
};

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { code } = await params;
  return <RoomPageClient code={code} />;
}
