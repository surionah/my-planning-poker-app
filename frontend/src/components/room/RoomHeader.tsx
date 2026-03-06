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
        dispatch({ type: 'SET_ERROR', value: 'Select a participant to continue.' });
        return;
      }
      dispatch({ type: 'SET_TRANSFERRING', value: true });
      try {
        await api.transferModerator(roomCode, selectedId, currentUser.sessionToken);
      } catch {
        dispatch({ type: 'SET_ERROR', value: 'Could not transfer the role. Please try again.' });
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
      <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-zinc-100">{room.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>{online} online · {participants.length} total</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
              <span className="text-xs text-zinc-500">Code:</span>
              <span className="font-mono font-bold text-violet-400 tracking-widest">{room.code}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy link
                </span>
              )}
            </Button>
            <div className="text-sm">
              <span className="text-zinc-500">Hi, </span>
              <span className="font-medium text-zinc-200">{currentUser.userName}</span>
              <span className="ml-1.5 text-xs text-violet-400 bg-violet-950/50 border border-violet-800 px-1.5 py-0.5 rounded-full">
                {isModerator ? 'Moderator' : 'Guest'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={openLeaveModal} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave
            </Button>
          </div>
        </div>
      </header>

      <Modal
        open={modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title={needsTransfer ? 'Assign new moderator' : 'Leave the room?'}
        className="max-w-lg"
      >
        {needsTransfer ? (
          <>
            <p className="text-sm text-zinc-400 mb-4">
              You are the moderator of this room. Before leaving, assign another participant as moderator.
            </p>
            <div className="space-y-2 mb-5 max-h-56 overflow-y-auto pr-1">
              {candidates.map((p) => (
                <button
                  key={p.id}
                  onClick={() => dispatch({ type: 'SELECT', id: p.id })}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all',
                    selectedId === p.id
                      ? 'border-violet-500 bg-violet-950/30'
                      : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50',
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {p.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
                    <p className="text-xs text-zinc-500">{p.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                  {selectedId === p.id && (
                    <svg className="w-5 h-5 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Cancel</Button>
              <Button variant="danger" onClick={handleConfirmLeave} disabled={transferring}>
                {transferring ? 'Transferring...' : 'Transfer and leave'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400 mb-6">
              {isModerator
                ? 'You are the only participant. The room will remain active and you can return with code '
                : 'Your session will end. You can rejoin using code '}
              <span className="font-mono font-bold text-violet-400">{room.code}</span>.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>Cancel</Button>
              <Button variant="danger" onClick={handleConfirmLeave}>Leave room</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
