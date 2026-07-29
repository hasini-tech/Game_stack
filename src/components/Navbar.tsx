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
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 px-3 py-3 backdrop-blur-md sm:px-8 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo & Title */}
        <button
          onClick={onHome}
          className="flex w-full items-center gap-3 text-left transition-opacity group hover:opacity-90 sm:w-auto"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,197,94,0.3)] sm:h-10 sm:w-10">
            <span className="text-lg font-black italic text-white sm:text-xl">S</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight uppercase text-white sm:text-xl">
              Tech Expo <span className="text-cyan-400">SaaS Crush</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
              Level 14 - Enterprise Solutions
            </p>
          </div>
        </button>

        {/* Action Links */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:grid-cols-none sm:items-center sm:gap-3">
          {status !== 'landing' && (
            <button
              onClick={onHome}
              title="Return to Expo Home"
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20 sm:px-4"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          )}

          <button
            onClick={onOpenCodex}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20 sm:px-4"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SaaS Codex</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20 sm:px-4"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Scores</span>
          </button>

          <button
            onClick={onToggleMute}
            className="flex min-h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 p-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
