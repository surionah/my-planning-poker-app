'use client';
import { Ticket, User, UserRole, RoomSession, TicketStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { FIBONACCI_CARDS } from '@/types';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VotingPanelProps {
  ticket: Ticket;
  session: RoomSession;
  roomCode: string;
  myVote: string | null;
  pendingVotersCount: number;
  participants: User[];
  votedUserIds: string[];
  onVoteCast: (value: string) => void;
  onReveal: () => void;
  onComplete: (estimate: string) => void;
}

export function VotingPanel({ ticket, session, roomCode, myVote, pendingVotersCount, participants, votedUserIds, onVoteCast, onReveal, onComplete }: VotingPanelProps) {
  const isModerator = session.role === UserRole.MODERATOR;
  const isVoting = ticket.status === TicketStatus.VOTING;
  const isRevealed = ticket.status === TicketStatus.REVEALED;
  const guestParticipants = participants.filter((p) => p.role === UserRole.GUEST);
  const guestVotedCount = guestParticipants.filter((p) => votedUserIds.includes(p.id)).length;
  const [selectedEstimate, setSelectedEstimate] = useState(ticket.finalEstimate || '');
  const [completing, setCompleting] = useState(false);

  async function handleVote(value: string) {
    if (!isVoting) return;
    try {
      await api.castVote(roomCode, ticket.id, { value, sessionToken: session.sessionToken });
      onVoteCast(value);
    } catch (err) {
      console.error('Vote error', err);
    }
  }

  async function handleReveal() {
    try {
      await api.revealVotes(roomCode, ticket.id, session.sessionToken);
      onReveal();
    } catch (err) {
      console.error('Reveal error', err);
    }
  }

  async function handleComplete() {
    if (!selectedEstimate) return;
    setCompleting(true);
    try {
      await api.completeTicket(roomCode, ticket.id, { finalEstimate: selectedEstimate }, session.sessionToken);
      onComplete(selectedEstimate);
    } catch (err) {
      console.error('Complete error', err);
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{ticket.title}</h2>
            {ticket.description && <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>}
          </div>
          {isVoting && isModerator && (
            <div className="flex flex-col items-end gap-1">
              <Button size="sm" onClick={handleReveal} variant="primary" disabled={pendingVotersCount > 0}>
                Reveal votes
              </Button>
              {pendingVotersCount > 0 && (
                <span className="text-xs text-amber-600">
                  {pendingVotersCount === 1 ? '1 participant pending' : `${pendingVotersCount} participants pending`}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {isVoting && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">
            {isModerator ? 'Select your estimate or wait for participants:' : 'Select your estimate:'}
          </p>
          <div className="grid grid-cols-7 gap-2">
            {FIBONACCI_CARDS.map((card) => (
              <button
                key={card}
                onClick={() => handleVote(card)}
                className={cn(
                  'aspect-[2/3] rounded-xl border-2 font-bold text-sm transition-all duration-150',
                  'hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  myVote === card
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400',
                )}
              >
                {card}
              </button>
            ))}
          </div>
          {myVote && (
            <p className="text-center text-sm text-indigo-600 mt-3 font-medium">
              Your vote: <span className="font-bold">{myVote}</span>
            </p>
          )}

          {/* Who voted / who hasn't */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Votes ({guestVotedCount}/{guestParticipants.length})
            </p>
            <div className="flex flex-wrap gap-4">
              {guestParticipants.map((p) => {
                  const voted = votedUserIds.includes(p.id);
                  const isMe = p.id === session.userId;
                  return (
                    <div key={p.id} className="flex flex-col items-center gap-1.5">
                      <div className={cn(
                        'w-10 h-14 rounded-lg border-2 flex items-center justify-center transition-all',
                        voted
                          ? 'border-indigo-500 bg-indigo-500 shadow-md'
                          : 'border-dashed border-gray-300 bg-gray-50',
                      )}>
                        {voted ? (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-gray-300 text-lg">?</span>
                        )}
                      </div>
                      <span className={cn(
                        'text-xs font-medium max-w-[56px] truncate text-center',
                        isMe ? 'text-indigo-600' : 'text-gray-600',
                      )}>
                        {isMe ? 'You' : p.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {isRevealed && isModerator && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Set final estimate:</p>
          <div className="flex gap-2 flex-wrap">
            {FIBONACCI_CARDS.map((card) => (
              <button
                key={card}
                onClick={() => setSelectedEstimate(card)}
                className={cn(
                  'w-10 h-12 rounded-lg border-2 font-bold text-sm transition-all',
                  selectedEstimate === card
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-200 hover:border-green-400 text-gray-700',
                )}
              >
                {card}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleComplete} disabled={!selectedEstimate || completing} variant="primary">
              {completing ? 'Saving...' : `Confirm: ${selectedEstimate || '-'}`}
            </Button>
          </div>
        </div>
      )}

      {isRevealed && !isModerator && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Waiting for the moderator to set the final estimate...
        </div>
      )}
    </div>
  );
}
