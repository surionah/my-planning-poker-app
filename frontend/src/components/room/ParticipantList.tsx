'use client';
import { User, UserRole, Ticket, TicketStatus, Vote } from '@/types';

interface ParticipantListProps {
  participants: User[];
  activeTicket: Ticket | null;
  votes: Vote[];
  votedUserIds: string[];
  currentUserId: string;
}

export function ParticipantList({ participants, activeTicket, votes, votedUserIds, currentUserId }: ParticipantListProps) {
  const isVoting = activeTicket?.status === TicketStatus.VOTING;
  const isRevealed = activeTicket?.status === TicketStatus.REVEALED || activeTicket?.status === TicketStatus.COMPLETED;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Participantes</h3>
      <div className="space-y-2">
        {participants.map((p) => {
          const vote = votes.find((v) => v.userId === p.id);
          const hasVoted = votedUserIds.includes(p.id);
          return (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${p.isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${p.id === currentUserId ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                  {p.name[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{p.name}</span>
                  {p.id === currentUserId && <span className="ml-1 text-xs text-gray-400">(Tú)</span>}
                </div>
              </div>
              {p.role === UserRole.MODERATOR ? (
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">Mod</span>
              ) : isRevealed && vote ? (
                <span className="text-sm font-bold text-indigo-700 bg-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center">
                  {vote.value}
                </span>
              ) : (isVoting || isRevealed) ? (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hasVoted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {hasVoted ? '✓ Votó' : 'Pendiente'}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
