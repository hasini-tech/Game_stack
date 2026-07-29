import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Trophy, BookOpen, Layers } from 'lucide-react';
import { GameMode } from '../types/game';
import { SAAS_PRODUCTS } from '../data/products';
import { SaaSLogo } from './SaaSLogo';

interface LandingScreenProps {
  highScore: number;
  onStartGame: (mode: GameMode) => void;
  onOpenCodex: () => void;
  onOpenLeaderboard: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  highScore,
  onStartGame,
  onOpenCodex,
  onOpenLeaderboard,
}) => {
  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-10rem)] w-full max-w-5xl flex-col items-center justify-between gap-8 px-4 py-4 text-center z-10 sm:min-h-[80vh] sm:px-6 sm:py-6">
      {/* Hero Header */}
      <div className="relative z-10 my-auto flex w-full flex-col items-center gap-6 pt-2 sm:pt-4">
        {/* Company Logo / Expo Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 backdrop-blur-md sm:text-xs"
        >
          <Sparkles className="h-4 w-4 animate-pulse text-cyan-400" />
          <span>TECH EXPO 2026 OFFICIAL SHOWCASE</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl sm:leading-tight">
            Tech Expo <span className="text-cyan-400">SaaS Crush</span>
          </h1>
          <p className="mx-auto max-w-xl text-xs font-bold uppercase tracking-widest text-white/60 sm:text-sm">
            Match Enterprise Solutions - Unlock SaaS Intelligence
          </p>
        </motion.div>

        {/* 7 SaaS App Icon Preview Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2.5 py-2 sm:gap-4 sm:py-3"
        >
          {SAAS_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={onOpenCodex}
              title={`${prod.name} - ${prod.tagline}`}
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-2.5 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-cyan-400/50 sm:p-3"
            >
              <SaaSLogo id={prod.id} size={36} glow={true} />
            </div>
          ))}
        </motion.div>

        {/* Play CTA Buttons & Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid w-full max-w-md grid-cols-1 gap-3 pt-4 sm:grid-cols-2 sm:gap-4"
        >
          <button
            onClick={() => onStartGame('timed')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-black shadow-2xl transition-colors hover:bg-cyan-400"
          >
            <Play className="h-4 w-4 fill-black" />
            <span>60s Expo Blitz</span>
          </button>

          <button
            onClick={() => onStartGame('zen')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            <Layers className="h-4 w-4 text-purple-400" />
            <span>Free Play</span>
          </button>
        </motion.div>

        {/* Secondary Navigation */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row sm:gap-6">
          <button
            onClick={onOpenCodex}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-cyan-400"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" /> Explore 7 SaaS Specs
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-amber-300"
          >
            <Trophy className="h-4 w-4 text-amber-400" /> Best: {highScore.toLocaleString()}
          </button>
        </div>
      </div>

      {/* Expo Footer Info */}
      <div className="relative z-10 flex w-full flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-center text-[10px] font-bold uppercase tracking-widest text-white/40 sm:flex-row sm:text-left">
        <span>2026 Tech Expo Enterprise Systems</span>
        <span>Match 3 icons to unlock instant product insights and QR demos</span>
      </div>
    </div>
  );
};
