import React from 'react';
import { Trophy, BookOpen, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types/game';
import techLogo from '../../assets/image/logo.png';

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
    <header className="sticky top-0 z-40 shrink-0 border-b border-[#d9e8df] bg-[#f5fff8]/95 px-2.5 py-1.5 backdrop-blur-md sm:px-8 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2">
        {/* Logo & Title */}
        <button
          onClick={onHome}
          className="flex min-w-0 items-center gap-2 text-left transition-opacity group hover:opacity-90 sm:gap-3"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white shadow-[0_0_15px_rgba(34,197,94,0.25)] sm:h-10 sm:w-10">
            <img
              src={techLogo}
              alt="Tech Vaseegrah"
              className="block h-[85%] w-[85%] object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-1">
            <h1 className="truncate text-[13px] leading-none font-bold tracking-tight uppercase text-black sm:text-xl">
              Tech Expo <span className="text-black">SaaS Crush</span>
            </h1>
            <p className="block text-[7px] leading-none font-bold uppercase tracking-widest text-black/50 sm:text-[10px]">
              Level 14 - Enterprise Solutions
            </p>
          </div>
        </button>

        {/* Action Links */}
        <div className="flex shrink-0 gap-1.5 sm:w-auto sm:items-center sm:gap-3">
          {status !== 'landing' && (
            <button
              onClick={onHome}
              title="Return to Expo Home"
              className="hidden min-h-7 items-center justify-center gap-1.5 rounded-md border border-[#d9e8df] bg-[#f5fff8] px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#e6f8e6] sm:flex sm:min-h-10 sm:px-4 sm:text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Main Menu</span>
            </button>
          )}

          <button
            onClick={onOpenCodex}
            aria-label="Open SaaS Codex"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-1 text-black transition-all hover:bg-[#e6f8e6] sm:h-auto sm:w-auto sm:min-h-10 sm:px-4 sm:text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">SaaS Codex</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            aria-label="Open scores"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-1 text-black transition-all hover:bg-[#e6f8e6] sm:h-auto sm:w-auto sm:min-h-10 sm:px-4 sm:text-xs"
          >
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Scores</span>
          </button>

          <button
            onClick={onToggleMute}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9e8df] bg-[#f5fff8] p-1 text-black transition-all hover:bg-[#e6f8e6] sm:h-auto sm:w-auto sm:min-h-10"
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
