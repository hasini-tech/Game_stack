import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tile, ScoreFloatingText } from '../types/game';
import { BOARD_SIZE, areAdjacent } from '../utils/gameLogic';
import { TileComponent } from './Tile';
import { ParticleEffectsCanvas, Particle } from './ParticleEffects';
import { getProductById } from '../data/products';

interface GameBoardProps {
  board: Tile[][];
  selectedTile: { row: number; col: number } | null;
  onSelectTile: (row: number, col: number) => void;
  onSwap: (r1: number, c1: number, r2: number, c2: number) => void;
  matchedTileIds: Set<string>;
  floatingScores: ScoreFloatingText[];
  motivationalMessage: string | null;
  isBusy: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedTile,
  onSelectTile,
  onSwap,
  matchedTileIds,
  floatingScores,
  motivationalMessage,
  isBusy,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidthPx, setBoardWidthPx] = useState<number>(360);
  const [tileSizePx, setTileSizePx] = useState<number>(40);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticleMatchKeyRef = useRef<string>('');
  const dragStartPosRef = useRef<{
    row: number;
    col: number;
    x: number;
    y: number;
    handled: boolean;
    pointerId: number;
  } | null>(null);

  // ResizeObserver / Window Resize to calculate exact tile and board pixel dimensions
  useEffect(() => {
    const updateSize = () => {
      const containerWidth = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
      const screenWidth = Math.min(containerWidth, window.innerWidth - 16);

      const innerPadding = 16; // 8px each side, matching p-2 on the board shell
      const gapPx = 3;
      const totalGaps = (BOARD_SIZE - 1) * gapPx;

      const maxAllowedContent = Math.min(screenWidth - innerPadding, 480);
      const minTileSize = window.innerWidth < 360 ? 18 : window.innerWidth < 480 ? 20 : 30;
      const computedTileSize = Math.max(
        minTileSize,
        Math.floor((maxAllowedContent - totalGaps) / BOARD_SIZE)
      );

      const computedBoardWidth = computedTileSize * BOARD_SIZE + totalGaps + innerPadding;
      setTileSizePx(computedTileSize);
      setBoardWidthPx(computedBoardWidth);
    };

    updateSize();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && containerRef.current
        ? new ResizeObserver(() => updateSize())
        : null;
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      resizeObserver?.disconnect();
    };
  }, []);

  // Spawn particle explosion when tiles are matched
  useEffect(() => {
    const matchKey = Array.from(matchedTileIds).sort().join('|');

    if (!matchKey) {
      lastParticleMatchKeyRef.current = '';
      setParticles([]);
      return;
    }

    if (lastParticleMatchKeyRef.current === matchKey) return;
    lastParticleMatchKeyRef.current = matchKey;

    const newParticles: Particle[] = [];
    matchedTileIds.forEach((id) => {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (board[r]?.[c]?.id === id) {
            const pId = board[r][c].productId;
            const product = getProductById(pId);
            const centerX = c * (tileSizePx + 3) + tileSizePx / 2 + 8;
            const centerY = r * (tileSizePx + 3) + tileSizePx / 2 + 8;

            for (let i = 0; i < 7; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 2 + Math.random() * 4;
              newParticles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 2.5 + Math.random() * 3,
                color: product.color.primaryHex,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.03,
              });
            }
          }
        }
      }
    });
    setParticles(newParticles);
  }, [matchedTileIds, tileSizePx, board]);

  const handleTileClick = (row: number, col: number) => {
    if (isBusy) return;

    if (!selectedTile) {
      onSelectTile(row, col);
    } else {
      if (selectedTile.row === row && selectedTile.col === col) {
        onSelectTile(-1, -1);
      } else if (areAdjacent(selectedTile.row, selectedTile.col, row, col)) {
        onSwap(selectedTile.row, selectedTile.col, row, col);
      } else {
        onSelectTile(row, col);
      }
    }
  };

  const handlePointerDown = (
    r: number,
    c: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (isBusy) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragStartPosRef.current = {
      row: r,
      col: c,
      x: e.clientX,
      y: e.clientY,
      handled: false,
      pointerId: e.pointerId,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartPosRef.current || dragStartPosRef.current.handled || isBusy) return;
    if (dragStartPosRef.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    const minSwipeDist = 14;

    if (Math.abs(dx) > minSwipeDist || Math.abs(dy) > minSwipeDist) {
      dragStartPosRef.current.handled = true;
      const { row, col } = dragStartPosRef.current;

      let targetR = row;
      let targetC = col;

      if (Math.abs(dx) > Math.abs(dy)) {
        targetC = dx > 0 ? col + 1 : col - 1;
      } else {
        targetR = dy > 0 ? row + 1 : row - 1;
      }

      if (
        targetR >= 0 &&
        targetR < BOARD_SIZE &&
        targetC >= 0 &&
        targetC < BOARD_SIZE
      ) {
        onSwap(row, col, targetR, targetC);
      }
    }
  };

  const clearPointerState = (pointerId: number) => {
    if (dragStartPosRef.current?.pointerId === pointerId) {
      dragStartPosRef.current = null;
    }
  };

  const handlePointerUp = (
    r: number,
    c: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragStartPosRef.current) return;
    if (dragStartPosRef.current.pointerId !== e.pointerId) return;

    if (!dragStartPosRef.current.handled && !isBusy) {
      handleTileClick(r, c);
    }

    clearPointerState(e.pointerId);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore browsers that already cleared capture on release.
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    clearPointerState(e.pointerId);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore browsers that already cleared capture on cancel.
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto select-none touch-none"
    >
      {/* Motivational Toast Banner */}
      <AnimatePresence>
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-10 z-40 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-4 py-1 rounded-full shadow-lg border border-white/20 pointer-events-none"
          >
            {motivationalMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glass Game Board Canvas Container */}
      <div
        className="relative rounded-3xl bg-white/5 p-2 shadow-2xl border border-white/10 backdrop-blur-md overflow-hidden touch-none"
        style={{
          width: boardWidthPx,
          height: boardWidthPx,
        }}
      >
        {/* Particle Canvas Overlay */}
        <ParticleEffectsCanvas
          particles={particles}
          width={boardWidthPx}
          height={boardWidthPx}
        />

        {/* Floating Scores Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <AnimatePresence>
            {floatingScores.map((scoreItem) => {
              const x = scoreItem.col * (tileSizePx + 3) + tileSizePx / 2 + 8;
              const y = scoreItem.row * (tileSizePx + 3) + tileSizePx / 2 + 8;
              return (
                <motion.div
                  key={scoreItem.id}
                  initial={{ opacity: 0, y: y, x: x - 25, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: y - 40,
                    scale: [0.6, 1.25, 1],
                  }}
                  transition={{ duration: 0.9, ease: 'easeOut', type: 'tween' }}
                  className="absolute font-black text-xs sm:text-sm text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap pointer-events-none"
                >
                  +{scoreItem.score}
                  {scoreItem.label && (
                    <span className="block text-[9px] text-cyan-300 font-bold uppercase tracking-tight">
                      {scoreItem.label}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 8x8 Grid Tiles */}
        <div
          className="grid grid-cols-8 gap-[3px] h-full w-full justify-center items-center touch-none"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, ${tileSizePx}px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, ${tileSizePx}px)`,
          }}
        >
          {board.map((rowArr, r) =>
            rowArr.map((tile, c) => {
              const isSelected =
                selectedTile !== null &&
                selectedTile.row === r &&
                selectedTile.col === c;
              const isMatched = matchedTileIds.has(tile.id);

              return (
                <div
                  key={tile.id}
                  onPointerDown={(e) => handlePointerDown(r, c, e)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(r, c, e)}
                  onPointerCancel={handlePointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className="flex items-center justify-center touch-none"
                >
                  <TileComponent
                    tile={tile}
                    isSelected={isSelected}
                    isMatched={isMatched}
                    sizePx={tileSizePx}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
