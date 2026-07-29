import React from 'react';
import { motion } from 'motion/react';
import { Pause, Play, Volume2, VolumeX, BookOpen, Trophy } from 'lucide-react';

interface HUDProps {
  score: number;
  highScore: number;
  timeRemaining: number;
  combo: number;
  maxCombo: number;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onOpenLeaderboard: () => void;
  isZenMode?: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  timeRemaining,
  combo,
  maxCombo,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  onOpenCodex,
  onOpenLeaderboard,
  isZenMode = false,
}) => {
  const isTimeWarning = !isZenMode && timeRemaining <= 10 && timeRemaining > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-2 sm:px-4 sm:py-2">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Stats: Score & Best */}
        <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center sm:gap-8">
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Score
            </p>
            <p className="font-mono text-xl font-bold text-white sm:text-2xl">
              {score.toLocaleString()}
            </p>
          </div>

          <div className="text-left pl-0 sm:border-l sm:border-white/10 sm:pl-4">
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Trophy className="h-3 w-3 text-amber-400" /> Best
            </p>
            <p className="font-mono text-sm font-bold text-amber-300 sm:text-lg">
              {highScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Center: Time Remaining & Combo Multiplier */}
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
          {!isZenMode ? (
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Time Remaining
              </p>
              <p
                className={`font-mono text-xl font-bold sm:text-2xl ${
                  isTimeWarning ? 'animate-pulse text-rose-400' : 'text-orange-400'
                }`}
              >
                00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Zen Mode
            </div>
          )}

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', type: 'tween' }}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Combo
              </span>
              <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-xl font-black italic text-transparent sm:text-2xl">
                x{combo}
              </span>
              {maxCombo > 1 && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Peak x{maxCombo}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Actions: Controls & Codex */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:justify-end">
          <button
            onClick={onOpenCodex}
            title="SaaS Product Codex"
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">Specs</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            title="Leaderboard"
            className="flex min-h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 p-2 text-xs font-bold uppercase tracking-widest text-amber-400 transition-all hover:bg-white/20"
          >
            <Trophy className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="flex min-h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 p-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>

          <button
            onClick={onTogglePause}
            className="flex min-h-10 items-center justify-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-cyan-400" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
