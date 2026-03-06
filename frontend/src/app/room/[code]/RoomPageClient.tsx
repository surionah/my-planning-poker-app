'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRoom } from '@/hooks/useRoom';
import { RoomHeader } from '@/components/room/RoomHeader';
import { TicketList } from '@/components/room/TicketList';
import { VotingPanel } from '@/components/room/VotingPanel';
import { VoteResults } from '@/components/room/VoteResults';
import { ParticipantList } from '@/components/room/ParticipantList';
import { JoinPrompt } from '@/components/room/JoinPrompt';
import { Ticket, TicketStatus, UserRole } from '@/types';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export default function RoomPageClient({ code }: { code: string }) {
  const router = useRouter();
  const roomCode = code.toUpperCase();

  const {
    room, session, setSession, participants, tickets, activeTicket,
    votes, votesRevealed, votedUserIds, myVote, setMyVote, loading, error, setError, reload,
  } = useRoom(roomCode);

  const pendingVotersCount = participants.filter(
    (p) => p.role === UserRole.GUEST && !votedUserIds.includes(p.id),
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando sala...</p>
        </div>
      </div>
    );
  }

  if (error === 'room_not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">Sala no encontrada</p>
          <p className="text-gray-500">El codigo {roomCode} no existe.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if ((error === 'no_session' || error === 'session_expired') && room) {
    return (
      <JoinPrompt
        roomCode={roomCode}
        roomName={room.name}
        onJoined={(sess) => {
          setSession(sess);
          setError(null);
          reload(sess);
        }}
      />
    );
  }

  if (!room || !session) return null;

  function handleLeave() {
    clearSession(roomCode);
    router.push('/');
  }

  async function handleStartVoting(ticket: Ticket) {
    if (!session) return;
    await api.startVoting(roomCode, ticket.id, session.sessionToken);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoomHeader
        room={room}
        participants={participants}
        currentUser={{ ...session, userId: session.userId }}
        roomCode={roomCode}
        onLeave={handleLeave}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <TicketList
            tickets={tickets}
            activeTicket={activeTicket}
            session={session}
            roomCode={roomCode}
            onTicketCreated={(ticket) => { /* handled via WS */ }}
            onStartVoting={handleStartVoting}
          />
          <ParticipantList
            participants={participants}
            activeTicket={activeTicket}
            votes={votes}
            votedUserIds={votedUserIds}
            currentUserId={session.userId}
          />
        </div>

        {/* Main area */}
        <div className="lg:col-span-3">
          {activeTicket && activeTicket.status !== TicketStatus.PENDING && activeTicket.status !== TicketStatus.COMPLETED ? (
            <div>
              <VotingPanel
                ticket={activeTicket}
                session={session}
                roomCode={roomCode}
                myVote={myVote}
                pendingVotersCount={pendingVotersCount}
                participants={participants}
                votedUserIds={votedUserIds}
                onVoteCast={(value) => setMyVote(value)}
                onReveal={() => {}}
                onComplete={() => {}}
              />
              {votesRevealed && (
                <VoteResults votes={votes} participants={participants} />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Planning Poker</h2>
              <p className="text-gray-500">
                {tickets.length === 0
                  ? session.role === UserRole.MODERATOR
                    ? 'Crea el primer ticket para comenzar la estimacion.'
                    : 'Esperando a que el moderador cree tickets...'
                  : session.role === UserRole.MODERATOR
                    ? 'Selecciona un ticket y presiona "Votar" para iniciar la estimacion.'
                    : 'Esperando a que el moderador inicie la votacion...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
