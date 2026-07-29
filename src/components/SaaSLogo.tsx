import React, { useId } from 'react';
import { SaaSProductId } from '../types/game';
import { getProductById } from '../data/products';

const logoImageModules = import.meta.glob('../../assets/image/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const logoImageFilesByKey: Partial<Record<string, string[]>> = {
  growthlab: ['insta-x-bot.png'],
  ciphergate: ['ciphergate.jpeg'],
  fynovo: ['billzzy-logo.png'],
  cloudsync: ['lite-logo.png'],
  omnidata: ['f3-icon.png'],
  pulsecrm: ['gowhat.png'],
};

function getLogoImageForKey(key: string): string | null {
  const filenames = logoImageFilesByKey[key];
  if (!filenames) return null;

  for (const filename of filenames) {
    const modulePath = `../../assets/image/${filename}`;
    const asset = logoImageModules[modulePath];
    if (asset) return asset;
  }

  return null;
}

interface SaaSLogoProps {
  id: SaaSProductId;
  className?: string;
  size?: number;
  glow?: boolean;
}

export const SaaSLogo: React.FC<SaaSLogoProps> = ({
  id,
  className = '',
  size = 36,
  glow = true,
}) => {
  const product = getProductById(id);
  const logoImage = getLogoImageForKey(product.key);
  const logoUid = useId().replace(/:/g, '');
  const grad = (index: number) => `grad-${index}-${logoUid}`;
  const billMask = `bill-mask-${logoUid}`;

  if (logoImage) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl p-1.5 transition-transform ${className} ${
          glow ? product.color.glow : ''
        }`}
        style={{
          width: size,
          height: size,
        }}
      >
        <img
          src={logoImage}
          alt={product.name}
          draggable={false}
          className="block h-full w-full select-none object-contain pointer-events-none"
        />
      </div>
    );
  }

  const getSvgContent = () => {
    switch (id) {
      case 0: // GrowthLab - AI mascot badge
        return (
          <g>
            <rect
              x="1.5"
              y="1.5"
              width="21"
              height="21"
              rx="6"
              fill={`url(#${grad(0)})`}
            />
            <circle cx="12" cy="4.2" r="1.7" fill="#ffffff" />
            <path
              d="M12 5.9V8"
              stroke="#ffffff"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <rect x="6" y="7.1" width="12" height="9.3" rx="4.4" fill="#ffffff" />
            <rect x="3.2" y="9.9" width="3.1" height="4.4" rx="1.25" fill="#ffffff" />
            <rect x="17.7" y="9.9" width="3.1" height="4.4" rx="1.25" fill="#ffffff" />
            <circle cx="9.2" cy="11.6" r="1.65" fill="#231c22" />
            <circle cx="14.8" cy="11.6" r="1.65" fill="#231c22" />
            <circle cx="8.5" cy="10.9" r="0.45" fill="#ffffff" />
            <circle cx="14.1" cy="10.9" r="0.45" fill="#ffffff" />
            <path
              d="M10 14.7c.45.55 1.15.82 2 .82s1.55-.27 2-.82"
              stroke="#231c22"
              strokeWidth="1.08"
              strokeLinecap="round"
            />
            <path
              d="M8.4 17.8h7.2c.55 0 .98.43.98.98v1.15c0 1.82-1.66 3.1-4.58 3.1s-4.58-1.28-4.58-3.1v-1.15c0-.55.43-.98.98-.98z"
              fill="#ffffff"
            />
            <circle
              cx="12"
              cy="20.1"
              r="1.55"
              fill="#ffffff"
              stroke={`url(#${grad(2)})`}
              strokeWidth="1.25"
            />
          </g>
        );

      case 1: // CipherGate - Eye and keyhole mark
        return (
          <g>
            <path
              d="M2.4 12c2.1-4.9 6.5-8 9.6-8s7.5 3.2 9.6 8c-2.1 4.9-6.5 8-9.6 8S4.5 16.9 2.4 12z"
              fill={`url(#${grad(1)})`}
            />
            <path
              d="M4.7 12c1.7-3.3 5.1-5.9 7.3-5.9s5.6 2.6 7.3 5.9c-1.7 3.3-5.1 5.9-7.3 5.9S6.4 15.3 4.7 12z"
              fill="#0a0a10"
            />
            <path
              d="M12 7.1c2.9 0 5.2 2.1 5.2 4.8 0 2.1-1.2 3.8-3.1 4.5l.2 2.4H9.7l.2-2.4c-1.9-.7-3.1-2.4-3.1-4.5 0-2.7 2.3-4.8 5.2-4.8zm0 1.6c-1.9 0-3.4 1.3-3.4 3.1 0 1.2.7 2.2 1.8 2.7l-.2 1.7h3.6l-.2-1.7c1.1-.5 1.8-1.5 1.8-2.7 0-1.8-1.5-3.1-3.4-3.1z"
              fill="#ef4444"
            />
            <circle cx="12" cy="12" r="0.8" fill="#ffffff" opacity="0.95" />
          </g>
        );

      case 2: // Fynovo - Blue geometric monogram
        return (
          <g>
            <defs>
              <mask id={billMask} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
                <rect x="4.8" y="4" width="4.8" height="16" rx="2.2" fill="#ffffff" />
                <rect x="7.2" y="4" width="8.6" height="5.9" rx="2.8" fill="#ffffff" />
                <rect x="7.2" y="13.9" width="8.6" height="5.9" rx="2.8" fill="#ffffff" />
              </mask>
            </defs>
            <rect
              x="4.5"
              y="4"
              width="14.6"
              height="16"
              rx="3.2"
              fill={`url(#${grad(2)})`}
              mask={`url(#${billMask})`}
            />
            <circle cx="14.8" cy="7.9" r="0.8" fill="#ffffff" opacity="0.95" />
            <circle cx="14.8" cy="16.1" r="0.8" fill="#ffffff" opacity="0.95" />
            <path
              d="M16.7 6.8l1.8-1.8m0 0h-1.4m1.4 0v1.4"
              stroke="#3b82f6"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        );

      case 3: // CloudSync - Multi-Cloud Mesh & Nodes
        return (
          <g>
            <path
              d="M18 10a4 4 0 00-7.5-1.5A3.5 3.5 0 005 12a3.5 3.5 0 00.5 7h12.5a3.5 3.5 0 000-7z"
              fill="none"
              stroke={`url(#${grad(3)})`}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="1.5" fill="#38bdf8" />
            <circle cx="8" cy="14" r="1.5" fill="#60a5fa" />
            <circle cx="16" cy="14" r="1.5" fill="#818cf8" />
            <path
              d="M8 14h8"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </g>
        );

      case 4: // DevPulse - Code Brackets & Heart Pulse
        return (
          <g>
            <path
              d="M7 8L3 12L7 16M17 8L21 12L17 16"
              fill="none"
              stroke={`url(#${grad(4)})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12h2.5l1.5-4 2 8 1.5-4H18"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 5: // OmniData - Hex ML Neural Network
        return (
          <g>
            <path
              d="M12 2L20 6.5V15.5L12 20L4 15.5V6.5L12 2Z"
              fill="none"
              stroke={`url(#${grad(5)})`}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="11" r="2.5" fill="#06b6d4" />
            <circle cx="8" cy="7" r="1.5" fill="#38bdf8" />
            <circle cx="16" cy="7" r="1.5" fill="#38bdf8" />
            <circle cx="8" cy="15" r="1.5" fill="#38bdf8" />
            <circle cx="16" cy="15" r="1.5" fill="#38bdf8" />
            <path
              d="M12 11L8 7M12 11L16 7M12 11L8 15M12 11L16 15"
              stroke="#0891b2"
              strokeWidth="1.5"
            />
          </g>
        );

      case 6: // PulseCRM - Customer Network Node
        return (
          <g>
            <circle cx="12" cy="7" r="3" fill={`url(#${grad(6)})`} />
            <path
              d="M6 19c0-3 2.5-5 6-5s6 2 6 5"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="19" cy="10" r="2" fill="#c084fc" />
            <circle cx="5" cy="10" r="2" fill="#818cf8" />
            <path
              d="M12 14v4M9 16h6"
              stroke="#e0e7ff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl p-1.5 transition-transform ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size * 0.8}
        height={size * 0.8}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`filter ${glow ? product.color.glow : ''}`}
      >
        <defs>
          <linearGradient id={grad(0)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#ff4fd8" />
            <stop offset="55%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id={grad(1)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id={grad(2)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="55%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={grad(3)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={grad(4)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id={grad(5)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id={grad(6)} x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {getSvgContent()}
      </svg>
    </div>
  );
};
