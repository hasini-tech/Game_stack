import React from 'react';
import { motion } from 'motion/react';
import { Tile as TileType } from '../types/game';
import { getProductById } from '../data/products';
import { SaaSLogo } from './SaaSLogo';

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  isMatched?: boolean;
  sizePx: number;
}

export const TileComponent: React.FC<TileProps> = ({
  tile,
  isSelected,
  isMatched = false,
  sizePx,
}) => {
  const product = getProductById(tile.productId);
  const iconSize = sizePx < 40 ? sizePx * 0.68 : sizePx * 0.58;

  return (
    <motion.div
      id={`tile-${tile.row}-${tile.col}`}
      layoutId={tile.id}
      initial={{ scale: tile.isNew ? 0 : 0.8, opacity: tile.isNew ? 0 : 1 }}
      animate={{
        scale: isMatched ? [1, 1.25, 0] : isSelected ? 1.08 : 1,
        opacity: isMatched ? [1, 1, 0] : 1,
        rotate: isMatched ? [0, 15, -15, 0] : 0,
      }}
      transition={
        isMatched
          ? { duration: 0.35, ease: 'easeOut', type: 'tween' }
          : { type: 'spring', stiffness: 400, damping: 28 }
      }
      whileHover={
        isMatched
          ? undefined
          : {
              scale: isSelected ? 1.1 : 1.05,
              y: -1,
            }
      }
      whileTap={isMatched ? undefined : { scale: 0.96 }}
      aria-label={product.name}
      title={product.name}
      className={`relative cursor-pointer select-none rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-center transition-all duration-200 will-change-transform ${
        isSelected
          ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105 z-20'
          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
      }`}
      style={{
        width: sizePx,
        height: sizePx,
        touchAction: 'none',
      }}
    >
      {/* Background Gradient Glow */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${product.color.gradient} opacity-15 hover:opacity-25 transition-opacity pointer-events-none`}
      />

      {/* Product Icon */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none">
        <SaaSLogo id={tile.productId} size={iconSize} glow={isSelected} />
      </div>

      <motion.div
        aria-hidden="true"
        className={`absolute inset-x-2 bottom-1 h-[2px] rounded-full ${
          isSelected ? 'bg-white/80' : 'bg-white/0'
        }`}
        animate={
          isSelected
            ? {
                opacity: [0.35, 1, 0.35],
                scaleX: [0.8, 1, 0.8],
              }
            : { opacity: 0 }
        }
        transition={isSelected ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut' } : undefined}
      />

      {/* Selected Indicator Glow */}
      {isSelected && (
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', type: 'tween' }}
          className={`absolute inset-0 rounded-xl border-2 ${product.color.border} pointer-events-none`}
        />
      )}
    </motion.div>
  );
};
