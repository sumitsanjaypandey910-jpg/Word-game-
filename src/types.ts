export type GameMode = 'WORDS' | 'SENTENCES' | 'EXPLORER';

export interface LetterNode {
  id: string;
  letter: string;
  x: number; // percentage or relative pixel position
  y: number;
  row?: number;
  col?: number;
  bgGradient?: string;
  borderColor?: string;
}

export interface WordTarget {
  id: string;
  word: string;
  clueEmoji: string;
  hint: string;
  found: boolean;
  fact?: string;
}

export interface WordLevel {
  id: number;
  title: string;
  category: string;
  themeEmoji: string;
  description: string;
  gridCols?: number;
  gridRows?: number;
  boardLetters: string[][]; // letters arranged on board
  targets: WordTarget[];
}

export interface SentenceLevel {
  id: number;
  title: string;
  themeEmoji: string;
  fullSentence: string;
  words: string[];
  boardLetters: string[][]; // letters on the screen
  clueIllustration: string;
  hint: string;
}

export interface StickerBadge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  targetCount: number;
  currentCount: number;
}

export interface DiscoveredWord {
  word: string;
  meaning: string;
  discoveredAt: number;
  emoji?: string;
}
