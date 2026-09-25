import { SaaSProduct } from '../types/game';

export const SAAS_PRODUCTS: SaaSProduct[] = [
  {
    id: 0,
    key: 'growthlab',
    name: 'InstaXBot',
    tagline: 'Intelligent Instagram Automation',
    category: 'Marketing Automation',
    shortDesc: 'Intelligent automation for smoother Instagram operations and faster growth.',
    fullDesc: 'InstaXBot provides intelligent automation for smoother Instagram operations and faster growth.',
    color: {
      bg: 'bg-fuchsia-950/80',
      text: 'text-fuchsia-400',
      border: 'border-fuchsia-500/40',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      gradient: 'from-fuchsia-500 via-pink-500 to-violet-600',
      badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      primaryHex: '#ec4899',
      secondaryHex: '#8b5cf6',
    },
    features: [
      'Automated Instagram Operations',
      'Faster Audience Growth Workflows',
      'Intelligent Social Automation'
    ],
    qrUrl: 'https://instaxbot.com/',
    statsLabel: 'Faster Instagram Growth'
  },
  {
    id: 1,
    key: 'ciphergate',
    name: 'CipherGate',
    tagline: 'Real-Time Facial Recognition Attendance',
    category: 'Workforce Automation',
    shortDesc: 'Lightning-fast, secure facial recognition attendance automates check-ins with accurate real-time tracking.',
    fullDesc: 'CipherGate automates attendance check-ins with lightning-fast, secure facial recognition, accurate real-time tracking, and efficient logs.',
    color: {
      bg: 'bg-purple-950/80',
      text: 'text-purple-400',
      border: 'border-purple-500/40',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      gradient: 'from-purple-400 via-fuchsia-500 to-indigo-500',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      primaryHex: '#a855f7',
      secondaryHex: '#6366f1',
    },
    features: [
      'Lightning-Fast Facial Recognition',
      'Accurate Real-Time Attendance Tracking',
      'Efficient Automated Attendance Logs'
    ],
    qrUrl: 'https://ciphergate.in/',
    statsLabel: 'Real-Time Check-In Accuracy'
  },
  {
    id: 2,
    key: 'fynovo',
    name: 'fynovo',
    tagline: 'Simple Inventory Tracking for Every Tool',
    category: 'Asset Management',
    shortDesc: 'Keep track of all your tools in one place and see who has what and where everything is.',
    fullDesc: 'fynovo makes it fast and simple to track all your tools, ownership, and locations in one place.',
    color: {
      bg: 'bg-blue-950/80',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      gradient: 'from-blue-500 via-indigo-500 to-cyan-500',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      primaryHex: '#3b82f6',
      secondaryHex: '#6366f1',
    },
    features: [
      'Centralized Tool Inventory',
      'Ownership and Location Tracking',
      'Fast, Simple Asset Lookup'
    ],
    qrUrl: 'https://tools.ciphergate.in/',
    statsLabel: 'One Place for Every Tool'
  },
  {
    id: 3,
    key: 'cloudsync',
    name: 'Lite Billzzy',
    tagline: 'Eco-Friendly Mobile Billing',
    category: 'Point of Sale',
    shortDesc: 'A fast, secure, and sustainable mobile-first billing solution for businesses of all sizes.',
    fullDesc: 'Lite Billzzy streamlines point of sale with an eco-friendly, mobile-first billing solution that replaces paper with fast, secure, and sustainable workflows.',
    color: {
      bg: 'bg-sky-950/80',
      text: 'text-sky-400',
      border: 'border-sky-500/40',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.4)]',
      gradient: 'from-sky-400 via-blue-500 to-indigo-600',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      primaryHex: '#38bdf8',
      secondaryHex: '#2563eb',
    },
    features: [
      'Mobile-First Point of Sale',
      'Paperless Billing Workflows',
      'Fast and Secure Transactions'
    ],
    qrUrl: 'https://lite.billzzy.com/',
    statsLabel: 'Fast, Paperless Checkout'
  },
  {
    id: 4,
    key: 'devpulse',
    name: 'Billzzy',
    tagline: 'Automated Billing and Smart Order Management',
    category: 'Billing & Orders',
    shortDesc: 'Streamline billing with automated address entry and smart order management.',
    fullDesc: 'Billzzy streamlines the billing process and boosts productivity with automated address entry and smart order management.',
    color: {
      bg: 'bg-rose-950/80',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      gradient: 'from-rose-400 via-pink-500 to-red-500',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      primaryHex: '#f43f5e',
      secondaryHex: '#ec4899',
    },
    features: [
      'Automated Address Entry',
      'Smart Order Management',
      'Faster Billing Workflows'
    ],
    qrUrl: 'https://billzzy.com/',
    statsLabel: 'Faster Billing Operations'
  },
  {
    id: 5,
    key: 'omnidata',
    name: 'F3 Engine',
    tagline: 'Fulfillment Command Center',
    category: 'Fulfillment Operations',
    shortDesc: 'Real-time inventory, smart order routing, and powerful analytics in one command center.',
    fullDesc: 'F3 Engine brings real-time inventory, smart order routing, and powerful analytics together in one command center built for modern fulfillment.',
    color: {
      bg: 'bg-cyan-950/80',
      text: 'text-cyan-400',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      gradient: 'from-cyan-300 via-teal-400 to-blue-500',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      primaryHex: '#06b6d4',
      secondaryHex: '#3b82f6',
    },
    features: [
      'Real-Time Inventory Visibility',
      'Smart Order Routing',
      'Fulfillment Analytics'
    ],
    qrUrl: 'https://f3engine.com/',
    statsLabel: 'One Fulfillment Command Center'
  },
  {
    id: 6,
    key: 'pulsecrm',
    name: 'GoWhats',
    tagline: 'Sales and Customer Engagement Automation',
    category: 'Sales Automation',
    shortDesc: 'Automate sales, inventory, and customer engagement with powerful API integration.',
    fullDesc: 'GoWhats automates sales, inventory, and customer engagement to help businesses experience growth on autopilot through powerful API integration.',
    color: {
      bg: 'bg-indigo-950/80',
      text: 'text-indigo-400',
      border: 'border-indigo-500/40',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      gradient: 'from-indigo-400 via-violet-500 to-purple-600',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      primaryHex: '#6366f1',
      secondaryHex: '#a855f7',
    },
    features: [
      'Automated Sales Workflows',
      'Inventory Integration',
      'Customer Engagement API'
    ],
    qrUrl: 'https://gowhats.in/',
    statsLabel: 'Growth on Autopilot'
  }
];

export function getProductById(id: number): SaaSProduct {
  return SAAS_PRODUCTS[id] || SAAS_PRODUCTS[0];
}
