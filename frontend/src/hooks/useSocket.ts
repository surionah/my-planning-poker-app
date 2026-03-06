'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useSocket(
  roomCode: string,
  sessionToken: string | null,
  handlers: Record<string, (data: any) => void>,
) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!sessionToken || !roomCode) return;

    const socket = io(WS_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('room:join', { roomCode, sessionToken });
    });

    // Use a stable wrapper that delegates to latest handlers via ref
    const wrappedHandlers: Record<string, (data: any) => void> = {};
    const eventNames = Object.keys(handlersRef.current);
    eventNames.forEach((event) => {
      wrappedHandlers[event] = (data: any) => handlersRef.current[event]?.(data);
      socket.on(event, wrappedHandlers[event]);
    });

    return () => {
      socket.emit('room:leave');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, sessionToken]); // stable deps — handlers updated via ref
}
