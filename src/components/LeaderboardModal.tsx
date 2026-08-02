import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Trophy, X, User } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/leaderboard')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load leaderboard.');
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setEntries(Array.isArray(payload.entries) ? payload.entries : []);
      })
      .catch(() => {
        if (isMounted) {
          setError('Could not load leaderboard data.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5fff8]/90 p-3 backdrop-blur-md sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-[#d9e8df] bg-[#f5fff8] p-5 shadow-2xl backdrop-blur-2xl sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-[#d9e8df] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-black">
                Tech Expo Leaderboard
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Top Challengers - Daily Standings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end rounded-full border border-[#d9e8df] bg-[#f5fff8] p-2 text-black transition-colors hover:bg-[#e6f8e6] sm:self-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Entries List */}
        <div className="my-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs font-bold uppercase tracking-widest text-black/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading scores
            </div>
          ) : error ? (
            <div className="py-10 text-center text-xs font-bold uppercase tracking-widest text-rose-500">
              {error}
            </div>
          ) : entries.length === 0 ? (
            <div className="py-10 text-center text-xs font-bold uppercase tracking-widest text-black/50">
              No database scores yet.
            </div>
          ) : (
            entries.map((item, idx) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  idx === 0
                    ? 'border-amber-400/30 bg-amber-400/10'
                    : idx === 1
                    ? 'border-[#d9e8df] bg-[#f5fff8]'
                    : idx === 2
                    ? 'border-orange-400/30 bg-orange-400/10'
                    : 'border-[#d9e8df] bg-[#f5fff8]'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5fff8] font-mono text-xs font-bold text-black">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-black">
                      <User className="h-3.5 w-3.5 shrink-0 text-black" />
                      <span className="break-words">{item.playerName}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end text-right sm:self-auto">
                  <div className="font-mono text-sm font-bold text-black">
                    {item.score.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
