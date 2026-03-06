import { RoomSession } from '@/types';

const SESSION_KEY_PREFIX = 'pp_session_';

export function saveSession(roomCode: string, session: RoomSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${SESSION_KEY_PREFIX}${roomCode}`, JSON.stringify(session));
}

export function getSession(roomCode: string): RoomSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`${SESSION_KEY_PREFIX}${roomCode}`);
  if (!data) return null;
  try {
    return JSON.parse(data) as RoomSession;
  } catch {
    return null;
  }
}

export function clearSession(roomCode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${SESSION_KEY_PREFIX}${roomCode}`);
}
