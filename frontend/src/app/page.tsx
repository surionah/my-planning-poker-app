import type { Metadata } from 'next';
import { CreateRoomForm } from '@/components/home/CreateRoomForm';
import { JoinRoomForm } from '@/components/home/JoinRoomForm';

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Collaboratively estimate user stories in real time with your team.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/40">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Planning Poker</h1>
          </div>
          <p className="text-lg text-zinc-400 max-w-md mx-auto">
            Collaboratively estimate user stories in real time with your team.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-8 hover:border-violet-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-950/60 border border-violet-800 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Create room</h2>
                <p className="text-sm text-zinc-400">Start a new planning session</p>
              </div>
            </div>
            <CreateRoomForm />
          </div>

          <div className="glass-card rounded-2xl p-8 hover:border-violet-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-950/60 border border-cyan-800 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Join room</h2>
                <p className="text-sm text-zinc-400">Enter with the invitation code</p>
              </div>
            </div>
            <JoinRoomForm />
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Fibonacci scale: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ∞, ☕
        </p>
      </div>
    </main>
  );
}
