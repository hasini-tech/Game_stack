import React from 'react';
import { Trophy, BookOpen, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types/game';

interface NavbarProps {
  status: GameStatus;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onOpenLeaderboard: () => void;
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  isMuted,
  onToggleMute,
  onOpenCodex,
  onOpenLeaderboard,
  onHome,
}) => {
  const isLanding = status === 'landing';
  const actionGridClass = isLanding ? 'grid grid-cols-3' : 'hidden sm:flex';

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-[#d9e8df] bg-[#f5fff8] px-3 py-2 backdrop-blur-md sm:px-8 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2">
        {/* Logo & Title */}
        <button
          onClick={onHome}
          className="flex min-w-0 items-center gap-2 text-left transition-opacity group hover:opacity-90 sm:gap-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1b9e4b] shadow-[0_0_15px_rgba(34,197,94,0.25)] sm:h-10 sm:w-10">
            <span className="text-base font-black italic text-black sm:text-xl">S</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight uppercase text-black sm:text-xl">
              Tech Expo <span className="text-black">SaaS Crush</span>
            </h1>
            <p className="hidden text-[10px] uppercase tracking-widest text-black/50 font-bold min-[380px]:block">
              Level 14 - Enterprise Solutions
            </p>
          </div>
        </button>

        {/* Action Links */}
        <div className={`${actionGridClass} shrink-0 gap-1.5 sm:w-auto sm:grid-cols-none sm:items-center sm:gap-3`}>
          {status !== 'landing' && (
            <button
              onClick={onHome}
              title="Return to Expo Home"
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#d9e8df] bg-[#f5fff8] px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10 sm:px-4 sm:text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          )}

          <button
            onClick={onOpenCodex}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#d9e8df] bg-[#f5fff8] px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10 sm:px-4 sm:text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">SaaS Codex</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#d9e8df] bg-[#f5fff8] px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10 sm:px-4 sm:text-xs"
          >
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Scores</span>
          </button>

          <button
            onClick={onToggleMute}
              className="flex min-h-9 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:min-h-10"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-black" />
            ) : (
              <Volume2 className="w-4 h-4 text-black" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
