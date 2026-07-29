import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './components/LandingScreen';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { ProductPopup } from './components/ProductPopup';
import { ProductCodexModal } from './components/ProductCodex';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SaaSProductId } from './types/game';
import { Play, RotateCcw, BookOpen } from 'lucide-react';

export default function App() {
  const {
    status,
    mode,
    board,
    selectedTile,
    setSelectedTile,
    matchedTileIds,
    score,
    highScore,
    combo,
    maxCombo,
    totalMatches,
    timeRemaining,
    timePlayed,
    floatingScores,
    educationalProductId,
    setEducationalProductId,
    motivationalMessage,
    isMuted,
    isBusy,
    startGame,
    togglePause,
    toggleMute,
    handleSwap,
    saveScoreToLeaderboard,
  } = useGameEngine();

  const [showCodex, setShowCodex] = useState<boolean>(false);
  const [codexInitialId, setCodexInitialId] = useState<SaaSProductId>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const openCodexWithProduct = (id: SaaSProductId = 0) => {
    setCodexInitialId(id);
    setShowCodex(true);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans selection:bg-cyan-400 selection:text-black overflow-x-hidden relative">
      {/* Background Ambient Glow Spots */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-700 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Navbar */}
      <Navbar
        status={status}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenCodex={() => openCodexWithProduct(0)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onHome={() => window.location.reload()}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 relative z-10">
        {status === 'landing' && (
          <LandingScreen
            highScore={highScore}
            onStartGame={(m) => startGame(m)}
            onOpenCodex={() => openCodexWithProduct(0)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
          />
        )}

        {(status === 'playing' || status === 'paused') && (
          <div className="w-full max-w-4xl mx-auto flex min-h-0 flex-col items-center gap-3 py-2 sm:my-auto">
            {/* Top HUD */}
            <HUD
              score={score}
              highScore={highScore}
              timeRemaining={timeRemaining}
              combo={combo}
              maxCombo={maxCombo}
              isPaused={status === 'paused'}
              isMuted={isMuted}
              onTogglePause={togglePause}
              onToggleMute={toggleMute}
              onOpenCodex={() => openCodexWithProduct(0)}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
              isZenMode={mode === 'zen'}
            />

            {/* Central 8x8 Game Board */}
            <GameBoard
              board={board}
              selectedTile={selectedTile}
              onSelectTile={(r, c) => setSelectedTile(r < 0 ? null : { row: r, col: c })}
              onSwap={(r1, c1, r2, c2) => handleSwap(r1, c1, r2, c2)}
              matchedTileIds={matchedTileIds}
              floatingScores={floatingScores}
              motivationalMessage={motivationalMessage}
              isBusy={isBusy}
            />

            {/* Non-intrusive Educational Live Match Banner */}
            <ProductPopup
              productId={educationalProductId}
              onClose={() => setEducationalProductId(null)}
              onOpenFullCodex={(id) => openCodexWithProduct(id)}
              mode="banner"
            />
          </div>
        )}

        {/* Pause Modal Overlay */}
        {status === 'paused' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050508]/85 backdrop-blur-md">
            <div className="relative w-full max-w-sm rounded-3xl bg-white/5 border border-white/10 p-6 shadow-2xl backdrop-blur-xl text-center space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Game Paused</h2>
              <p className="text-xs text-white/60">
                Take a breather! Explore our SaaS products or resume your streak.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={togglePause}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Resume Game</span>
                </button>

                <button
                  onClick={() => openCodexWithProduct(0)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Explore SaaS Codex</span>
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold uppercase tracking-widest border border-rose-500/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Quit to Menu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {status === 'gameover' && (
          <GameOverModal
            score={score}
            totalMatches={totalMatches}
            maxCombo={maxCombo}
            timePlayed={timePlayed}
            mode={mode}
            onPlayAgain={() => startGame(mode)}
            onOpenCodex={() => openCodexWithProduct(0)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onSaveScore={(name) => saveScoreToLeaderboard(name)}
          />
        )}

        {/* Full SaaS Product Gallery Modal */}
        {showCodex && (
          <ProductCodexModal
            initialProductId={codexInitialId}
            onClose={() => setShowCodex(false)}
          />
        )}

        {/* High Score Leaderboard Modal */}
        {showLeaderboard && (
          <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
        )}
      </main>

      {/* Elegant Dark Footer */}
      <footer className="z-10 flex h-auto flex-col items-center justify-between gap-2 border-t border-white/10 bg-black/40 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40 sm:h-12 sm:flex-row sm:px-8 sm:py-0">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
          <span>Tech Expo SaaS Match-3</span>
          <span className="hidden sm:inline">Enterprise Solutions Arena</span>
        </div>
        <div className="flex items-center justify-center gap-4 sm:justify-end">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">Live Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
