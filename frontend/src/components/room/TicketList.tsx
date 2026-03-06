'use client';
import { useState } from 'react';
import { Ticket, TicketStatus, UserRole, RoomSession } from '@/types';
import { TicketStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

interface TicketListProps {
  tickets: Ticket[];
  activeTicket: Ticket | null;
  session: RoomSession;
  roomCode: string;
  onTicketCreated: (ticket: Ticket) => void;
  onStartVoting: (ticket: Ticket) => void;
}

export function TicketList({ tickets, activeTicket, session, roomCode, onTicketCreated, onStartVoting }: TicketListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const isModerator = session.role === UserRole.MODERATOR;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const ticket = await api.createTicket(roomCode, { title: title.trim(), description: description.trim() || undefined }, session.sessionToken) as Ticket;
      onTicketCreated(ticket);
      setTitle('');
      setDescription('');
      setModalOpen(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Tickets ({tickets.length})</h3>
        {isModerator && (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Button>
        )}
      </div>
      <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
        {tickets.length === 0 && (
          <div className="p-6 text-center text-sm text-zinc-500">
            {isModerator ? 'Create the first ticket to get started' : 'Waiting for tickets...'}
          </div>
        )}
        {tickets.map((ticket) => {
          const isActive = activeTicket?.id === ticket.id;
          const isPending = ticket.status === TicketStatus.PENDING;
          const isVoting = ticket.status === TicketStatus.VOTING;
          return (
            <div
              key={ticket.id}
              className={`group px-3 py-2.5 transition-colors ${isActive ? 'bg-violet-950/30 border-l-4 border-l-violet-500' : 'border-l-4 border-l-transparent hover:bg-zinc-800/50'}`}
            >
              <div className="flex items-center gap-2">
                {/* Status dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isVoting ? 'bg-amber-400 animate-pulse' :
                  ticket.status === TicketStatus.COMPLETED ? 'bg-emerald-400' :
                  isActive ? 'bg-violet-400' : 'bg-zinc-600'
                }`} />

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-violet-300' : 'text-zinc-300'}`}>
                    {ticket.title}
                  </p>
                  {ticket.finalEstimate && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Estimate: <span className="font-bold text-violet-400">{ticket.finalEstimate}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isModerator && isPending ? (
                    <button
                      onClick={() => onStartVoting(ticket)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-700 text-white hover:bg-violet-600 transition-colors shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Vote
                    </button>
                  ) : (
                    <TicketStatusBadge status={ticket.status} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" placeholder="PROJ-123: Implement login" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label htmlFor="ticket-description" className="block text-sm font-medium text-zinc-300 mb-1">Description (optional)</label>
            <textarea
              id="ticket-description"
              className="w-full px-3 py-2 border border-zinc-700 bg-zinc-900 text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={3}
              placeholder="Ticket details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create ticket'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
