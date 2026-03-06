'use client';
import { Vote, User } from '@/types';

interface VoteResultsProps {
  votes: Vote[];
  participants: User[];
}

export function VoteResults({ votes, participants }: VoteResultsProps) {
  if (votes.length === 0) return null;

  const valueCounts: Record<string, number> = {};
  votes.forEach((v) => {
    if (v.value !== 'hidden') {
      valueCounts[v.value] = (valueCounts[v.value] || 0) + 1;
    }
  });

  const maxCount = Math.max(...Object.values(valueCounts));
  const sortedValues = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);
  const numericVotes = votes.filter((v) => !isNaN(Number(v.value))).map((v) => Number(v.value));
  const avg = numericVotes.length > 0 ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1) : null;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mt-4">
      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Results</h3>

      {avg && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-violet-950/40 border border-violet-900 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-300">{avg}</p>
            <p className="text-xs text-violet-400">Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-300">{sortedValues[0]?.[0] || '-'}</p>
            <p className="text-xs text-violet-400">Most voted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-300">{votes.length}</p>
            <p className="text-xs text-violet-400">Votes</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sortedValues.map(([value, count]) => (
          <div key={value} className="flex items-center gap-3">
            <span className="w-10 text-center font-bold text-zinc-400 text-sm">{value}</span>
            <div className="flex-1 bg-zinc-800 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-600 to-violet-500 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                <span className="text-white text-xs font-bold">{count}</span>
              </div>
            </div>
            <div className="flex -space-x-1">
              {votes.filter((v) => v.value === value).map((v) => {
                const user = participants.find((p) => p.id === v.userId);
                return (
                  <div key={v.userId} className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white" title={v.userName}>
                    {(v.userName || user?.name || '?')[0].toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
