'use client';
import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';
import { UserRole } from '@/types';

interface JoinPromptProps {
  roomCode: string;
  roomName: string;
  onJoined: (session: { sessionToken: string; userId: string; role: UserRole; userName: string }) => void;
}

export function JoinPrompt({ roomCode, roomName, onJoined }: JoinPromptProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.joinRoom(roomCode, { name: name.trim() }) as any;
      const session = {
        sessionToken: result.sessionToken,
        userId: result.user.id,
        role: UserRole.GUEST as UserRole,
        userName: result.user.name,
      };
      saveSession(roomCode, session);
      onJoined(session);
    } catch (err: any) {
      setError(err.message || 'Error joining room');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-600/20 border border-violet-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">Join the room</h2>
          <p className="text-zinc-400 mt-1">{roomName}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your name"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-800 px-3 py-2 rounded-lg">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? 'Joining...' : 'Enter room'}
          </Button>
        </form>
      </div>
    </div>
  );
}
