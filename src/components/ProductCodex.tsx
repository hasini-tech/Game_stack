import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, QrCode, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { SAAS_PRODUCTS } from '../data/products';
import { SaaSProductId } from '../types/game';
import { SaaSLogo } from './SaaSLogo';
import { generateSvgQrPath } from '../utils/qr';

interface ProductCodexProps {
  initialProductId?: SaaSProductId;
  onClose: () => void;
}

export const ProductCodexModal: React.FC<ProductCodexProps> = ({
  initialProductId = 0,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<SaaSProductId>(initialProductId);
  const activeProduct = SAAS_PRODUCTS[selectedId];
  const qrGrid = generateSvgQrPath(activeProduct.qrUrl, 21);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/85 p-3 backdrop-blur-md sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-2xl sm:h-[90vh] sm:p-6"
      >
        {/* Header Bar */}
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 animate-pulse text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Tech Expo SaaS Codex
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Level 14 - 7 Enterprise Solutions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white sm:self-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content: Split Grid */}
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-12 md:overflow-hidden">
          {/* Left Product List Selector (4 cols) */}
          <div className="flex gap-2 overflow-x-auto pb-2 pr-1 md:col-span-4 md:flex-col md:overflow-y-auto md:pb-0">
            {SAAS_PRODUCTS.map((prod) => {
              const isSelected = prod.id === selectedId;
              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedId(prod.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all md:shrink ${
                    isSelected
                      ? 'border-cyan-400/50 bg-white/10 text-white shadow-lg'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <SaaSLogo id={prod.id} size={36} glow={isSelected} />
                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isSelected ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {prod.name}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      {prod.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Product Details Sheet (8 cols) */}
          <div className="flex min-h-0 flex-col justify-between overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:col-span-8 sm:p-6">
            <div className="space-y-4">
              {/* Product Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                    <SaaSLogo id={activeProduct.id} size={48} glow={true} />
                  </div>
                  <div>
                    <span className="mb-1 inline-block rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      {activeProduct.category}
                    </span>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                      {activeProduct.name}
                    </h3>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    KPI Metric
                  </span>
                  <div className="font-mono text-xs font-bold text-cyan-400">
                    {activeProduct.statsLabel}
                  </div>
                </div>
              </div>

              {/* Tagline & Full Description */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider italic text-cyan-400">
                  "{activeProduct.tagline}"
                </p>
                <p className="rounded-xl border border-white/10 bg-black/30 p-3.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                  {activeProduct.fullDesc}
                </p>
              </div>

              {/* Key Capabilities List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Enterprise Capabilities
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 text-xs font-medium text-white/90"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-cyan-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer: QR Code & Expo Link */}
            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-md">
                  <svg width={56} height={56} viewBox="0 0 21 21">
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
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white">
                    <QrCode className="h-3.5 w-3.5 text-amber-400" /> Expo Booth QR
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50">
                    Scan for sandbox demo
                  </div>
                </div>
              </div>

              <a
                href={activeProduct.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-cyan-400 sm:w-auto"
              >
                <span>Visit Portal</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
