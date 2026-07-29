export type SaaSProductId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SaaSProduct {
  id: SaaSProductId;
  key: string;
  name: string;
  tagline: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  color: {
    bg: string;
    text: string;
    border: string;
    glow: string;
    gradient: string;
    badgeBg: string;
    primaryHex: string;
    secondaryHex: string;
  };
  features: string[];
  qrUrl: string;
  statsLabel: string;
}

export type SpecialTileType = 'horizontal' | 'vertical' | 'rainbow' | null;

export interface Tile {
  id: string; // Unique tile instance ID
  productId: SaaSProductId;
  row: number;
  col: number;
  isMatched?: boolean;
  specialType?: SpecialTileType;
  isNew?: boolean;
}

export type GameMode = 'timed' | 'zen';

export type GameStatus = 'landing' | 'playing' | 'paused' | 'gameover';

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface ScoreFloatingText {
  id: string;
  score: number;
  row: number;
  col: number;
  combo: number;
  label?: string;
  productId?: SaaSProductId;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  maxCombo: number;
  totalMatches: number;
  rank: RankTier;
  date: string;
  mode: GameMode;
}

export interface GameStats {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  totalMatches: number;
  timeRemaining: number;
  timePlayed: number;
}

export interface MovePosition {
  row: number;
  col: number;
}
