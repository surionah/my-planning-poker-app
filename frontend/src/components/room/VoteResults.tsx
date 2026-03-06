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
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Resultados</h3>

      {avg && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-indigo-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-700">{avg}</p>
            <p className="text-xs text-indigo-500">Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-700">{sortedValues[0]?.[0] || '-'}</p>
            <p className="text-xs text-indigo-500">Mas votado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-700">{votes.length}</p>
            <p className="text-xs text-indigo-500">Votos</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sortedValues.map(([value, count]) => (
          <div key={value} className="flex items-center gap-3">
            <span className="w-10 text-center font-bold text-gray-700 text-sm">{value}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                <span className="text-white text-xs font-bold">{count}</span>
              </div>
            </div>
            <div className="flex -space-x-1">
              {votes.filter((v) => v.value === value).map((v) => {
                const user = participants.find((p) => p.id === v.userId);
                return (
                  <div key={v.userId} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white" title={v.userName}>
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
