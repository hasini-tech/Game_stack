import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, ArrowRight } from 'lucide-react';
import { SaaSProductId } from '../types/game';
import { getProductById } from '../data/products';
import { SaaSLogo } from './SaaSLogo';
import { generateSvgQrPath } from '../utils/qr';

interface ProductPopupProps {
  productId: SaaSProductId | null;
  onClose: () => void;
  onOpenFullCodex?: (id: SaaSProductId) => void;
  mode?: 'modal' | 'banner';
}

export const ProductPopup: React.FC<ProductPopupProps> = ({
  productId,
  onClose,
  onOpenFullCodex,
  mode = 'modal',
}) => {
  const [showQr, setShowQr] = useState<boolean>(false);

  // Auto close banner mode after 4 seconds unless interacted
  useEffect(() => {
    if (productId === null) {
      setShowQr(false);
      return;
    }

    if (mode === 'banner') {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [productId, mode, onClose]);

  if (productId === null) return null;

  const product = getProductById(productId);
  const qrGrid = generateSvgQrPath(product.qrUrl, 21);

  if (mode === 'banner') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="relative mx-auto flex w-full max-w-lg flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-left shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400" />
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2">
              <SaaSLogo id={product.id} size={36} glow={true} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">
                  {product.category}
                </span>
                <span className="text-[9px] font-bold uppercase text-white/40">
                  Matched Tech
                </span>
              </div>
              <h4 className="truncate text-xs font-bold uppercase tracking-tight text-white">
                {product.name}
              </h4>
              <p className="truncate text-[10px] italic text-white/70">
                "{product.tagline}"
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <button
              onClick={() => {
                if (onOpenFullCodex) onOpenFullCodex(product.id);
              }}
              className="flex min-h-10 items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black shadow transition-colors hover:bg-cyan-400"
            >
              <span>Specs</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={onClose}
              className="flex min-h-10 items-center justify-center rounded-lg bg-white/10 p-2 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/85 p-3 backdrop-blur-md sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl sm:p-6"
        >
          {/* Cyan Glow Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Main Card Content */}
          <div className="mt-2 flex flex-col items-center space-y-4 text-center">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl">
              <SaaSLogo id={product.id} size={56} glow={true} />
            </div>

            <div>
              <span className="mb-2 inline-block rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
                {product.name}
              </h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider italic text-cyan-400">
                "{product.tagline}"
              </p>
            </div>

            <p className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed text-white/70">
              {product.shortDesc}
            </p>

            <div className="w-full space-y-2 text-left">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="rounded-xl bg-white p-2.5 shadow-lg">
                  <svg width={140} height={140} viewBox="0 0 21 21">
                    {qrGrid.map((rowArr, r) =>
                      rowArr.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width={1}
                            height={1}
                            fill="#050508"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  <QrCode className="h-3.5 w-3.5 text-cyan-400" /> Scan Expo QR Demo
                </span>
              </motion.div>
            )}

            <div className="grid w-full grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <button
                onClick={() => setShowQr(!showQr)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
              >
                <QrCode className="h-4 w-4 text-amber-400" />
                <span>{showQr ? 'Hide QR' : 'Expo QR'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenFullCodex) onOpenFullCodex(product.id);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-cyan-400"
              >
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
