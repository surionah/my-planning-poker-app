'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';
import { UserRole } from '@/types';

export function CreateRoomForm() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [moderatorName, setModeratorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!roomName.trim() || !moderatorName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.createRoom({ name: roomName.trim(), moderatorName: moderatorName.trim() }) as any;
      saveSession(result.room.code, {
        sessionToken: result.sessionToken,
        userId: result.user.id,
        role: UserRole.MODERATOR,
        userName: result.user.name,
      });
      router.push(`/room/${result.room.code}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear la sala');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la sala"
        placeholder="Sprint 42 Planning"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        required
        minLength={2}
        maxLength={50}
      />
      <Input
        label="Tu nombre (Moderador)"
        placeholder="John Doe"
        value={moderatorName}
        onChange={(e) => setModeratorName(e.target.value)}
        required
        minLength={2}
        maxLength={50}
      />
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Creando...' : 'Crear sala'}
      </Button>
    </form>
  );
}
