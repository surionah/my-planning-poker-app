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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Participants</h3>
      <div className="space-y-2">
        {participants.map((p) => {
          const vote = votes.find((v) => v.userId === p.id);
          const hasVoted = votedUserIds.includes(p.id);
          return (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${p.isOnline ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${p.id === currentUserId ? 'from-violet-500 to-violet-700' : 'from-zinc-600 to-zinc-700'}`}>
                  {p.name[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-medium text-zinc-200">{p.name}</span>
                  {p.id === currentUserId && <span className="ml-1 text-xs text-zinc-500">(You)</span>}
                </div>
              </div>
              {p.role === UserRole.MODERATOR ? (
                <span className="text-xs text-violet-400 bg-violet-950/50 border border-violet-800 px-2 py-0.5 rounded-full font-medium">Mod</span>
              ) : isRevealed && vote ? (
                <span className="text-sm font-bold text-violet-300 bg-violet-950/50 border border-violet-700 w-8 h-8 rounded-lg flex items-center justify-center">
                  {vote.value}
                </span>
              ) : (isVoting || isRevealed) ? (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${hasVoted ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                  {hasVoted ? '✓ Voted' : 'Pending'}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
