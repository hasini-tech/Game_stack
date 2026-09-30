import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, BookOpen, Medal, Sparkles, Check } from 'lucide-react';
import { RankTier, GameMode } from '../types/game';

interface GameOverModalProps {
  score: number;
  totalMatches: number;
  maxCombo: number;
  timePlayed: number;
  mode: GameMode;
  onOpenCodex: () => void;
  onOpenLeaderboard: () => void;
  onSaveScore: (playerName: string) => Promise<void> | void;
  initialPlayerName?: string;
}

export function calculateRankTier(score: number): RankTier {
  if (score >= 15000) return 'Platinum';
  if (score >= 8000) return 'Gold';
  if (score >= 3000) return 'Silver';
  return 'Bronze';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  totalMatches,
  maxCombo,
  timePlayed,
  mode,
  onOpenCodex,
  onOpenLeaderboard,
  onSaveScore,
  initialPlayerName = '',
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasSaveAttemptedRef = useRef(false);
  const rank = calculateRankTier(score);

  // Trigger confetti when game over modal mounts!
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#a855f7', '#38bdf8', '#f59e0b', '#f43f5e'],
      });
    } catch {
      // Ignore confetti errors
    }
  }, []);

  const getRankBadgeStyle = (currentRank: RankTier) => {
    switch (currentRank) {
      case 'Platinum':
        return {
          bg: 'bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400',
          text: 'text-slate-950',
          border: 'border-cyan-200',
          glow: 'shadow-[0_0_30px_rgba(56,189,248,0.6)]',
        };
      case 'Gold':
        return {
          bg: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400',
          text: 'text-slate-950',
          border: 'border-amber-200',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
        };
      case 'Silver':
        return {
          bg: 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400',
          text: 'text-slate-950',
          border: 'border-slate-100',
          glow: 'shadow-[0_0_20px_rgba(203,213,225,0.4)]',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900',
          text: 'text-amber-100',
          border: 'border-amber-600',
          glow: 'shadow-[0_0_20px_rgba(180,83,9,0.4)]',
        };
    }
  };

  const badgeStyle = getRankBadgeStyle(rank);

  useEffect(() => {
    if (hasSaveAttemptedRef.current) return;

    hasSaveAttemptedRef.current = true;
    const playerName = initialPlayerName.trim();
    if (!playerName) {
      setSaveError('Enter a player name before starting the game.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    Promise.resolve(onSaveScore(playerName))
      .then(() => {
        setIsSaved(true);
        onOpenLeaderboard();
      })
      .catch(() => {
        setSaveError('Score could not be saved. Please try again.');
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [initialPlayerName, onOpenLeaderboard, onSaveScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5fff8]/90 p-3 backdrop-blur-md sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[#d9e8df] bg-[#f5fff8] p-5 text-center shadow-2xl backdrop-blur-2xl sm:p-8"
      >
        {/* Glow Header Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

        {/* Title */}
        <div className="mb-2 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Expo Challenge Completed
          </span>
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-tight text-black sm:text-4xl">
          Game Over!
        </h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/50">
          Great performance at the Tech Expo Arena in {mode === 'zen' ? 'Zen Mode' : 'Timed Mode'}
        </p>

        {/* Rank Badge Showcase */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-lg font-black uppercase tracking-widest sm:px-6 sm:text-2xl ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${badgeStyle.glow}`}
          >
            <Medal className="h-6 w-6 shrink-0" />
            <span>{rank} Rank</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="my-4 grid grid-cols-2 gap-2.5 rounded-2xl border border-[#d9e8df] bg-[#f5fff8] p-4 text-left sm:grid-cols-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
              Final Score
            </span>
            <div className="font-mono text-lg font-bold text-black">
              {score.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
              Matches
            </span>
            <div className="font-mono text-lg font-bold text-emerald-400">
              {totalMatches}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
              Max Combo
            </span>
            <div className="font-mono text-lg font-bold text-cyan-400">
              x{maxCombo}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
              Time Played
            </span>
            <div className="font-mono text-lg font-bold text-orange-400">
              {timePlayed}s
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="mb-5 flex items-center justify-center gap-1.5 rounded-xl border border-[#d9e8df] bg-[#f5fff8] p-2 text-xs font-bold uppercase tracking-widest text-black/60">
            Saving score to leaderboard
          </div>
        )}

        {isSaved && (
          <div className="mb-5 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Check className="h-4 w-4" /> Score Saved to Leaderboard!
          </div>
        )}

        {saveError && (
          <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-xs font-bold uppercase tracking-widest text-rose-500">
            {saveError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#d9e8df] bg-[#f5fff8] px-4 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6]"
          >
            <Trophy className="h-4 w-4 text-black" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={onOpenCodex}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#d9e8df] bg-[#f5fff8] px-4 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6]"
          >
            <BookOpen className="h-4 w-4 text-black" />
            <span>SaaS Specs</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
