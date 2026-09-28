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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5fff8]/90 p-3 backdrop-blur-md sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-y-auto rounded-[18px] border border-[#d9e8df] bg-[#f5fff8] p-4 shadow-2xl backdrop-blur-2xl md:overflow-hidden sm:h-[min(90dvh,720px)] sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 border-b border-[#d9e8df] pb-4 sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-black sm:text-2xl">
                Tech Expo SaaS Codex
              </h2>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-black/50 sm:text-[10px]">
                Level 14 - 7 Enterprise Solutions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close SaaS Codex"
            title="Close SaaS Codex"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9e8df] bg-[#f5fff8] text-black transition-colors hover:border-[#1b9e4b] hover:bg-[#e6f8e6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content: Split Grid */}
        <div className="mt-4 flex flex-col gap-4 overflow-visible md:grid md:min-h-0 md:flex-1 md:grid-cols-[214px_minmax(0,1fr)] md:gap-4 md:overflow-hidden">
          {/* Left Product List Selector (4 cols) */}
          <div className="min-w-0 shrink-0 md:overflow-y-auto md:pr-1">
            <div className="mb-2 hidden items-center justify-between px-1 md:flex">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
                Solutions
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/35">
                07
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
            {SAAS_PRODUCTS.map((prod) => {
              const isSelected = prod.id === selectedId;
              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedId(prod.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`flex min-h-[54px] min-w-[154px] shrink-0 items-center gap-2 rounded-xl border p-2.5 text-left transition-all sm:gap-3 md:min-w-0 ${
                    isSelected
                      ? 'border-[#1b9e4b] bg-[#1b9e4b] text-black shadow-[0_8px_18px_rgba(27,158,75,0.2)]'
                      : 'border-[#d9e8df] bg-[#f5fff8] text-black hover:border-[#a9cfb6] hover:bg-[#e6f8e6]'
                  }`}
                >
                  <SaaSLogo id={prod.id} size={30} glow={isSelected} />
                  <div className="min-w-0">
                    <div className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
                      {prod.name}
                    </div>
                    <div className="truncate text-[8px] font-bold uppercase tracking-[0.12em] text-black/60 sm:text-[9px]">
                      {prod.category}
                    </div>
                  </div>
                </button>
              );
            })}
            </div>
          </div>

          {/* Right Product Details Sheet (8 cols) */}
          <div className="flex flex-none flex-col justify-between overflow-visible rounded-[14px] border border-[#d9e8df] bg-white/35 p-4 backdrop-blur-xl md:min-h-0 md:overflow-y-auto sm:p-5 md:p-6">
            <div className="space-y-4">
              {/* Product Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-[#d9e8df] bg-[#f5fff8] p-2.5 shadow-sm">
                    <SaaSLogo id={activeProduct.id} size={48} glow={true} />
                  </div>
                  <div>
                    <span className="mb-1 inline-block rounded-md border border-cyan-400/30 bg-cyan-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-600">
                      {activeProduct.category}
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black sm:text-2xl">
                      {activeProduct.name}
                    </h3>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
                    KPI Metric
                  </span>
                  <div className="max-w-[190px] font-mono text-[11px] font-bold text-cyan-600">
                    {activeProduct.statsLabel}
                  </div>
                </div>
              </div>

              {/* Tagline & Full Description */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider italic text-cyan-600">
                  "{activeProduct.tagline}"
                </p>
                <p className="rounded-xl border border-[#d9e8df] bg-[#f5fff8]/75 p-3.5 text-xs leading-relaxed text-black/75 sm:text-sm">
                  {activeProduct.fullDesc}
                </p>
              </div>

              {/* Key Capabilities List */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
                  Enterprise Capabilities
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-[#d9e8df] bg-[#f5fff8]/75 p-2 text-xs font-medium text-black/85"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-cyan-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer: QR Code & Expo Link */}
            <div className="mt-6 flex flex-col gap-4 border-t border-[#d9e8df] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-md">
                  <svg width={62} height={62} viewBox="0 0 21 21">
                    {qrGrid.map((rowArr, r) =>
                      rowArr.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width={1}
                            height={1}
                            fill="#000000"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black">
                    <QrCode className="h-3.5 w-3.5 text-amber-500" /> Expo Booth QR
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-black/50">
                    Scan for sandbox demo
                  </div>
                </div>
              </div>

              <a
                href={activeProduct.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1b9e4b] px-5 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-[#17903f] sm:w-auto"
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
