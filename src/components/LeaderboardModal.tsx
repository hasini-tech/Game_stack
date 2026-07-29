import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, X, Trash2, User } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  onClose: () => void;
}

const LOCAL_STORAGE_KEY = 'saas_crush_leaderboard_v1';

export function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage parse error
  }
  return [
    {
      id: 'demo-1',
      playerName: 'Alex Vance (Tech Lead)',
      score: 18450,
      maxCombo: 6,
      totalMatches: 42,
      rank: 'Platinum',
      date: 'Today',
      mode: 'timed',
    },
    {
      id: 'demo-2',
      playerName: 'Sarah Chen (DevOps)',
      score: 12100,
      maxCombo: 4,
      totalMatches: 31,
      rank: 'Gold',
      date: 'Today',
      mode: 'timed',
    },
    {
      id: 'demo-3',
      playerName: 'Jordan Miller',
      score: 7200,
      maxCombo: 3,
      totalMatches: 22,
      rank: 'Silver',
      date: 'Yesterday',
      mode: 'timed',
    },
  ];
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>) {
  const current = getStoredLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `lb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or restriction
  }
  return updated;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getStoredLeaderboard());
  }, []);

  const handleClear = () => {
    if (confirm('Clear local leaderboard records?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setEntries([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/85 p-3 backdrop-blur-md sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                Tech Expo Leaderboard
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Top Challengers - Daily Standings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white sm:self-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Entries List */}
        <div className="my-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <div className="py-10 text-center text-xs font-bold uppercase tracking-widest text-white/40">
              No recorded scores yet. Claim 1st place now!
            </div>
          ) : (
            entries.map((item, idx) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  idx === 0
                    ? 'border-amber-400/30 bg-amber-400/10'
                    : idx === 1
                    ? 'border-white/30 bg-white/10'
                    : idx === 2
                    ? 'border-orange-400/30 bg-orange-400/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 font-mono text-xs font-bold text-white">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white">
                      <User className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      <span className="break-words">{item.playerName}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                      <span>Combo: x{item.maxCombo}</span>
                      <span>-</span>
                      <span>{item.rank}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end text-right sm:self-auto">
                  <div className="font-mono text-sm font-bold text-cyan-400">
                    {item.score.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    {item.date}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {entries.length > 0 && (
          <div className="flex justify-center border-t border-white/10 pt-3 sm:justify-end">
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-rose-400 opacity-80 transition-opacity hover:text-rose-300 hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
