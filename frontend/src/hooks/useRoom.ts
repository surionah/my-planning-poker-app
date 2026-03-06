'use client';
import { useState, useEffect, useCallback } from 'react';
import { Room, User, Ticket, Vote, RoomSession, TicketStatus, UserRole } from '@/types';
import { api } from '@/lib/api';
import { getSession, saveSession, clearSession } from '@/lib/session';
import { useSocket } from './useSocket';

export function useRoom(roomCode: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<RoomSession | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [votesRevealed, setVotesRevealed] = useState(false);
  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketHandlers = {
    'room:joined': ({ userId }: { userId: string }) => {
      if (!session) return;
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === userId);
        if (exists) {
          return prev.map((p) => p.id === userId ? { ...p, isOnline: true } : p);
        }
        return [...prev, { id: userId, name: session.userName, role: session.role, isOnline: true } as User];
      });
    },
    'participant:joined': (data: { userId: string; name: string; role: User['role'] }) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === data.userId);
        if (exists) {
          return prev.map((p) => p.id === data.userId ? { ...p, isOnline: true } : p);
        }
        return [...prev, { id: data.userId, name: data.name, role: data.role, isOnline: true } as User];
      });
    },
    'participant:left': ({ userId }: { userId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    },
    'ticket:created': (ticket: Ticket) => {
      setTickets((prev) => [...prev, ticket]);
    },
    'ticket:voting-started': (ticket: Ticket) => {
      setTickets((prev) => prev.map((t) => t.id === ticket.id ? ticket : t));
      setActiveTicket(ticket);
      setVotes([]);
      setVotesRevealed(false);
      setVotedUserIds([]);
      setMyVote(null);
    },
    'ticket:votes-revealed': ({ ticket, votes: revealedVotes }: { ticket: Ticket; votes: Vote[] }) => {
      setTickets((prev) => prev.map((t) => t.id === ticket.id ? ticket : t));
      setActiveTicket(ticket);
      setVotes(revealedVotes);
      setVotesRevealed(true);
    },
    'ticket:completed': (ticket: Ticket) => {
      setTickets((prev) => prev.map((t) => t.id === ticket.id ? ticket : t));
      setActiveTicket(null);
      setVotes([]);
      setVotesRevealed(false);
      setVotedUserIds([]);
      setMyVote(null);
    },
    'vote:cast': ({ userId }: { ticketId: string; userId: string; voted: boolean }) => {
      setVotedUserIds((prev) => prev.includes(userId) ? prev : [...prev, userId]);
    },
    'moderator:transferred': ({ newModeratorId, previousModeratorId }: { newModeratorId: string; previousModeratorId: string }) => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === newModeratorId) return { ...p, role: UserRole.MODERATOR };
          if (p.id === previousModeratorId) return { ...p, role: UserRole.GUEST };
          return p;
        }),
      );
      setSession((prev) => {
        if (!prev) return prev;
        if (prev.userId === newModeratorId) return { ...prev, role: UserRole.MODERATOR };
        if (prev.userId === previousModeratorId) return { ...prev, role: UserRole.GUEST };
        return prev;
      });
    },
  };

  useSocket(roomCode, session?.sessionToken || null, socketHandlers);

  const loadRoomData = useCallback(async (sess: RoomSession) => {
    const [participantsData, ticketsData] = await Promise.all([
      api.getParticipants(roomCode) as Promise<User[]>,
      api.getTickets(roomCode) as Promise<Ticket[]>,
    ]);
    setParticipants(participantsData.filter((p) => p.isOnline));
    setTickets(ticketsData);
    const votingTicket = ticketsData.find((t) => t.status === TicketStatus.VOTING || t.status === TicketStatus.REVEALED);
    if (votingTicket) {
      setActiveTicket(votingTicket);
      const votesData = await api.getVotes(roomCode, votingTicket.id) as any;
      const fetchedVotes: Vote[] = votesData.votes || [];
      setVotedUserIds(fetchedVotes.map((v) => v.userId));
      if (votingTicket.status === TicketStatus.REVEALED) {
        setVotes(fetchedVotes);
        setVotesRevealed(true);
        const myV = fetchedVotes.find((v) => v.userId === sess.userId);
        if (myV) setMyVote(myV.value);
      } else {
        const myV = fetchedVotes.find((v) => v.userId === sess.userId);
        if (myV) setMyVote(myV.value);
      }
    }
  }, [roomCode]);

  useEffect(() => {
    async function init() {
      try {
        const roomData = await api.getRoom(roomCode) as Room;
        setRoom(roomData);
        const existingSession = getSession(roomCode);
        if (existingSession) {
          try {
            const result = await api.reconnect(roomCode, existingSession.sessionToken) as any;
            const sess = { ...existingSession, userId: result.user.id };
            setSession(sess);
            saveSession(roomCode, sess);
            await loadRoomData(sess);
          } catch {
            clearSession(roomCode);
            setError('session_expired');
          }
        } else {
          setError('no_session');
        }
      } catch {
        setError('room_not_found');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [roomCode, loadRoomData]);

  return {
    room, session, setSession, participants, tickets, activeTicket,
    votes, votesRevealed, votedUserIds, myVote, setMyVote, loading, error, setError,
    reload: (sess?: RoomSession) => { const s = sess ?? session; if (s) loadRoomData(s); },
  };
}
