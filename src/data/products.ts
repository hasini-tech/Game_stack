import { SaaSProduct } from '../types/game';

export const SAAS_PRODUCTS: SaaSProduct[] = [
  {
    id: 0,
    key: 'growthlab',
    name: 'GrowthLab',
    tagline: 'AI Marketing Automation Platform',
    category: 'Marketing & AI',
    shortDesc: 'Automate multi-channel AI campaigns and smart lead scoring in real-time.',
    fullDesc: 'GrowthLab leverages autonomous AI agents to build, optimize, and scale global marketing campaigns across search, social, and email with 10x ROI conversion accuracy.',
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
      'Autonomous AI Ad Campaign Manager',
      'Predictive Customer Lead Scoring',
      'Real-time Attribution Analytics'
    ],
    qrUrl: 'https://techexpo2026.saas/products/growthlab',
    statsLabel: '+340% Marketing ROI'
  },
  {
    id: 1,
    key: 'ciphergate',
    name: 'CipherGate',
    tagline: 'Cyber Security & Compliance Engine',
    category: 'Cybersecurity',
    shortDesc: 'Zero-Trust cloud security monitoring and instant threat mitigation.',
    fullDesc: 'CipherGate delivers continuous Zero-Trust security monitoring, automated threat defense, and one-click compliance auditing for SOC2, ISO27001, and HIPAA.',
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
      'Zero-Trust Identity & Access Guard',
      'Instant AI Cyber Threat Mitigation',
      'Continuous Automated SOC2 / ISO Audit'
    ],
    qrUrl: 'https://techexpo2026.saas/products/ciphergate',
    statsLabel: '99.999% Zero-Breach Guard'
  },
  {
    id: 2,
    key: 'fynovo',
    name: 'Fynovo',
    tagline: 'Smart Financial Management & Billing',
    category: 'FinTech & RevOps',
    shortDesc: 'Unified subscription management and automated cash flow AI.',
    fullDesc: 'Fynovo orchestrates complex multi-currency recurring billing, usage revenue recognition, and predictive AI financial planning for global SaaS enterprises.',
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
      'Automated Usage-based RevRec',
      'Global Multi-Currency Billing Engine',
      'Predictive AI Cashflow Forecasting'
    ],
    qrUrl: 'https://techexpo2026.saas/products/fynovo',
    statsLabel: '100% ASC 606 Compliant'
  },
  {
    id: 3,
    key: 'cloudsync',
    name: 'CloudSync',
    tagline: 'Multi-Cloud Infrastructure Orchestrator',
    category: 'DevOps & Cloud',
    shortDesc: 'Deploy, scale, and optimize hybrid cloud workloads across AWS, GCP & Azure.',
    fullDesc: 'CloudSync provides unified mesh management for Kubernetes and cloud infrastructure with intelligent auto-scaling, disaster recovery, and 40% cost reduction.',
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
      'Multi-Cloud Auto-Healing Infrastructure',
      'Real-Time FinOps Cost Minimizer',
      'One-Click Kubernetes Cluster Mesh'
    ],
    qrUrl: 'https://techexpo2026.saas/products/cloudsync',
    statsLabel: '42% Avg Cloud Cost Reduction'
  },
  {
    id: 4,
    key: 'devpulse',
    name: 'DevPulse',
    tagline: 'CI/CD & Developer Productivity Suite',
    category: 'Developer Tools',
    shortDesc: 'Accelerate engineering speed with instant previews and AI code reviews.',
    fullDesc: 'DevPulse cuts build and deploy cycle times by 80% with ephemeral preview environments, intelligent test parallelization, and AI pull request code audits.',
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
      'Sub-Second CI/CD Build Pipelines',
      'Instant Ephemeral Branch Previews',
      'Automated AI Code Quality Guard'
    ],
    qrUrl: 'https://techexpo2026.saas/products/devpulse',
    statsLabel: '5x Deployment Velocity'
  },
  {
    id: 5,
    key: 'omnidata',
    name: 'OmniData',
    tagline: 'Big Data Analytics & ML Engine',
    category: 'Data & AI Platform',
    shortDesc: 'Sub-second streaming analytics and vector search for enterprise AI.',
    fullDesc: 'OmniData powers high-throughput data processing, ultra-fast vector similarity search, and automated machine learning model deployment at petabyte scale.',
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
      'Sub-10ms Vector Database Querying',
      'Real-Time Streaming Event Engine',
      'No-Code AutoML Model Studio'
    ],
    qrUrl: 'https://techexpo2026.saas/products/omnidata',
    statsLabel: '10M+ Events/Sec Engine'
  },
  {
    id: 6,
    key: 'pulsecrm',
    name: 'PulseCRM',
    tagline: 'Customer Experience & Sales CRM',
    category: 'Sales & Growth',
    shortDesc: 'Omnichannel customer relationship hub with AI conversation intelligence.',
    fullDesc: 'PulseCRM unifies customer communications, sales pipelines, and support tickets with generative AI agents that draft responses and close deals faster.',
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
      'Unified 360-degree Customer Timeline',
      'Autonomous Voice & Text Sales Copilot',
      'Predictive Deal Velocity Analytics'
    ],
    qrUrl: 'https://techexpo2026.saas/products/pulsecrm',
    statsLabel: '2.5x Deal Closure Rate'
  }
];

export function getProductById(id: number): SaaSProduct {
  return SAAS_PRODUCTS[id] || SAAS_PRODUCTS[0];
}
