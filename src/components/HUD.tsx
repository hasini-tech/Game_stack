import React from 'react';
import { motion } from 'motion/react';
import { Pause, Play, Volume2, VolumeX, BookOpen, Trophy } from 'lucide-react';

interface HUDProps {
  playerName: string;
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
  playerName,
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
    <div className="mx-auto w-full max-w-4xl px-0 py-0 sm:px-4 sm:py-2">
      <div className="grid grid-cols-4 items-center gap-1.5 rounded-xl border border-[#d9e8df] bg-[#f5fff8] p-2 shadow-lg backdrop-blur-xl sm:flex sm:gap-3 sm:rounded-2xl sm:p-4 lg:justify-between">
        {/* Left Stats: Score & Best */}
        <div className="col-span-2 grid min-w-0 grid-cols-2 gap-1.5 sm:flex sm:w-auto sm:items-center sm:gap-8">
          <div className="min-w-0 text-left">
            <p className="flex min-w-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-black/50 sm:text-[10px]">
              <span className="shrink-0">Score</span>
              <span className="truncate text-black/70" title={playerName}>
                {playerName}
              </span>
            </p>
            <p className="truncate font-mono text-base font-bold text-black sm:text-2xl">
              {score.toLocaleString()}
            </p>
          </div>

          <div className="min-w-0 text-left pl-0 sm:border-l sm:border-[#d9e8df] sm:pl-4">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-black/50 sm:text-[10px]">
              <Trophy className="h-3 w-3 text-amber-400" /> Best
            </p>
            <p className="truncate font-mono text-xs font-bold text-black sm:text-lg">
              {highScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Center: Time Remaining & Combo Multiplier */}
        <div className="col-span-2 flex min-w-0 items-center justify-end gap-1.5 sm:w-auto sm:justify-start sm:gap-4">
          {!isZenMode ? (
            <div className="min-w-0 text-right sm:text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-black/50 sm:text-[10px]">
                Time
              </p>
              <p
                className={`font-mono text-base font-bold sm:text-2xl ${
                  isTimeWarning ? 'animate-pulse text-rose-600' : 'text-black'
                }`}
              >
                00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-[#d9e8df] bg-[#f5fff8] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-black sm:px-3 sm:text-[10px]">
              Zen Mode
            </div>
          )}

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', type: 'tween' }}
              className="flex min-w-12 flex-col items-center rounded-lg border border-[#d9e8df] bg-[#f5fff8] px-2 py-1 sm:rounded-xl sm:px-3 sm:py-2"
            >
              <span className="text-[8px] font-bold uppercase tracking-widest text-black sm:text-[10px]">
                Combo
              </span>
              <span className="text-base font-black italic text-black sm:text-2xl">
                x{combo}
              </span>
              {maxCombo > 1 && (
                <span className="hidden text-[9px] font-bold uppercase tracking-widest text-black/50 sm:block">
                  Peak x{maxCombo}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Actions: Controls & Codex */}
        <div className="col-span-4 grid w-full grid-cols-4 gap-1.5 sm:flex sm:w-auto sm:items-center sm:justify-end sm:gap-2">
          <button
            onClick={onOpenCodex}
            title="SaaS Product Codex"
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-[#d9e8df] bg-[#f5fff8] px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10 sm:px-3 sm:text-xs"
          >
            <BookOpen className="h-3.5 w-3.5 text-black" />
            <span className="hidden md:inline">Specs</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            title="Leaderboard"
            className="flex min-h-10 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10"
          >
            <Trophy className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="flex min-h-10 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-black" />
            ) : (
              <Volume2 className="h-4 w-4 text-black" />
            )}
          </button>

          <button
            onClick={onTogglePause}
            className="flex min-h-10 items-center justify-center gap-1 rounded-md bg-[#1b9e4b] px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-[#17903f] sm:min-h-10 sm:px-3 sm:text-xs"
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5 fill-black text-black" />
                <span className="hidden min-[380px]:inline">Play</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-black" />
                <span className="hidden min-[380px]:inline">Pause</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
