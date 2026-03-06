export enum UserRole {
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

export enum TicketStatus {
  PENDING = 'PENDING',
  VOTING = 'VOTING',
  REVEALED = 'REVEALED',
  COMPLETED = 'COMPLETED',
}

export interface Room {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  sessionToken: string;
  isOnline: boolean;
  roomId: string;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  finalEstimate?: string;
  order: number;
  roomId: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  value: string;
  userId: string;
  ticketId: string;
  userName?: string;
}

export interface RoomSession {
  sessionToken: string;
  userId: string;
  role: UserRole;
  userName: string;
}

export const FIBONACCI_CARDS = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞', '☕'];
