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
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tickets ({tickets.length})</h3>
        {isModerator && (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </Button>
        )}
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {tickets.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-400">
            {isModerator ? 'Crea el primer ticket para empezar' : 'Esperando tickets...'}
          </div>
        )}
        {tickets.map((ticket) => {
          const isActive = activeTicket?.id === ticket.id;
          const isPending = ticket.status === TicketStatus.PENDING;
          const isVoting = ticket.status === TicketStatus.VOTING;
          return (
            <div
              key={ticket.id}
              className={`group px-3 py-2.5 transition-colors ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                {/* Status dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isVoting ? 'bg-amber-400 animate-pulse' :
                  ticket.status === TicketStatus.COMPLETED ? 'bg-green-400' :
                  isActive ? 'bg-indigo-400' : 'bg-gray-300'
                }`} />

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
                    {ticket.title}
                  </p>
                  {ticket.finalEstimate && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Estimado: <span className="font-bold text-indigo-600">{ticket.finalEstimate}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isModerator && isPending ? (
                    <button
                      onClick={() => onStartVoting(ticket)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Votar
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Titulo" placeholder="PROJ-123: Implementar login" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label htmlFor="ticket-description" className="block text-sm font-medium text-gray-700 mb-1">Descripcion (opcional)</label>
            <textarea
              id="ticket-description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Detalles del ticket..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear ticket'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
