'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';
import { UserRole } from '@/types';

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.joinRoom(code.trim().toUpperCase(), { name: name.trim() }) as any;
      saveSession(result.room.code, {
        sessionToken: result.sessionToken,
        userId: result.user.id,
        role: UserRole.GUEST,
        userName: result.user.name,
      });
      router.push(`/room/${result.room.code}`);
    } catch (err: any) {
      setError(err.message || 'Room not found');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Room code"
        placeholder="ABC123"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        required
        maxLength={6}
        className="uppercase tracking-widest font-mono text-center text-lg"
      />
      <Input
        label="Your name"
        placeholder="Jane Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={50}
      />
      {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-800 px-3 py-2 rounded-lg">{error}</p>}
      <Button type="submit" variant="secondary" disabled={loading} className="w-full !border-cyan-700 !text-cyan-300 hover:!bg-cyan-950/40" size="lg">
        {loading ? 'Joining...' : 'Join room'}
      </Button>
    </form>
  );
}
