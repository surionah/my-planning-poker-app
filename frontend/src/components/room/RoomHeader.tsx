'use client';
import { useReducer } from 'react';
import { Room, User, UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface RoomHeaderProps {
  room: Room;
  participants: User[];
  currentUser: { userName: string; role: UserRole; userId: string; sessionToken: string };
  roomCode: string;
  onLeave: () => void;
}

type State = {
  copied: boolean;
  modalOpen: boolean;
  selectedId: string | null;
  transferring: boolean;
  error: string;
};

type Action =
  | { type: 'SET_COPIED'; value: boolean }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SELECT'; id: string }
  | { type: 'SET_TRANSFERRING'; value: boolean }
  | { type: 'SET_ERROR'; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COPIED': return { ...state, copied: action.value };
    case 'OPEN_MODAL': return { ...state, modalOpen: true, selectedId: null, error: '' };
    case 'CLOSE_MODAL': return { ...state, modalOpen: false };
    case 'SELECT': return { ...state, selectedId: action.id, error: '' };
    case 'SET_TRANSFERRING': return { ...state, transferring: action.value };
    case 'SET_ERROR': return { ...state, error: action.value };
  }
}

export function RoomHeader({ room, participants, currentUser, roomCode, onLeave }: RoomHeaderProps) {
  const [{ copied, modalOpen, selectedId, transferring, error }, dispatch] = useReducer(reducer, {
    copied: false,
    modalOpen: false,
    selectedId: null,
    transferring: false,
    error: '',
  });

  const isModerator = currentUser.role === UserRole.MODERATOR;
  const candidates = participants.filter(
    (p) => p.id !== currentUser.userId && p.role !== UserRole.MODERATOR,
  );

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    dispatch({ type: 'SET_COPIED', value: true });
    setTimeout(() => dispatch({ type: 'SET_COPIED', value: false }), 2000);
  };

  function openLeaveModal() {
    dispatch({ type: 'OPEN_MODAL' });
  }

  async function handleConfirmLeave() {
    if (isModerator && candidates.length > 0) {
      if (!selectedId) {
        dispatch({ type: 'SET_ERROR', value: 'Selecciona un participante para continuar.' });
        return;
      }
      dispatch({ type: 'SET_TRANSFERRING', value: true });
      try {
        await api.transferModerator(roomCode, selectedId, currentUser.sessionToken);
      } catch {
        dispatch({ type: 'SET_ERROR', value: 'No se pudo transferir el rol. Intenta de nuevo.' });
        dispatch({ type: 'SET_TRANSFERRING', value: false });
        return;
      }
      dispatch({ type: 'SET_TRANSFERRING', value: false });
    }
    dispatch({ type: 'CLOSE_MODAL' });
    onLeave();
  }

  const online = participants.filter((p) => p.isOnline).length;
  const needsTransfer = isModerator && candidates.length > 0;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{room.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>{online} online · {participants.length} total</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">Código:</span>
              <span className="font-mono font-bold text-gray-900 tracking-widest">{room.code}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copiar link
                </span>
              )}
            </Button>
            <div className="text-sm">
              <span className="text-gray-500">Hola, </span>
              <span className="font-medium text-gray-900">{currentUser.userName}</span>
              <span className="ml-1.5 text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                {isModerator ? 'Moderador' : 'Invitado'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={openLeaveModal} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <Modal
        open={modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title={needsTransfer ? 'Designar nuevo moderador' : '¿Salir de la sala?'}
        className="max-w-lg"
      >
        {needsTransfer ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Eres el moderador de esta sala. Antes de salir, designa a otro participante como moderador.
            </p>
            <div className="space-y-2 mb-5 max-h-56 overflow-y-auto pr-1">
              {candidates.map((p) => (
                <button
                  key={p.id}
                  onClick={() => dispatch({ type: 'SELECT', id: p.id })}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all',
                    selectedId === p.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {p.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.isOnline ? 'En línea' : 'Desconectado'}</p>
                  </div>
                  {selectedId === p.id && (
                    <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmLeave} disabled={transferring}>
                {transferring ? 'Transfiriendo...' : 'Transferir y salir'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {isModerator
                ? 'Eres el único participante. La sala seguirá activa y podrás volver con el código '
                : 'Tu sesión se cerrará. Podrás volver a unirte usando el código '}
              <span className="font-mono font-bold text-indigo-600">{room.code}</span>.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmLeave}>Salir de la sala</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
