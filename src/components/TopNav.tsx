import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, HelpCircle, BookOpen } from 'lucide-react';
import { GameMode } from '../types';
import { kidAudio } from '../utils/audio';

interface TopNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStickers: () => void;
  onOpenHelp: () => void;
  onOpenWordBook: () => void;
  discoveredCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  stars,
  isMuted,
  onToggleMute,
  onOpenStickers,
  onOpenHelp,
  onOpenWordBook,
  discoveredCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-black tracking-tight text-amber-600 drop-shadow-xs cursor-pointer select-none"
            onClick={() => onSelectMode('WORDS')}
          >
            WordSparks
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented Mode Controls */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              kidAudio.playPopSound();
              onSelectMode('WORDS');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              currentMode === 'WORDS'
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            Word Quest
          </button>

          <button
            onClick={() => {
              kidAudio.playPopSound();
              onSelectMode('SENTENCES');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              currentMode === 'SENTENCES'
                ? 'bg-emerald-600 text-white shadow-sm scale-105'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Sentence Builder
          </button>

          <button
            onClick={() => {
              kidAudio.playPopSound();
              onSelectMode('EXPLORER');
            }}
            className={`hidden md:inline-flex px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              currentMode === 'EXPLORER'
                ? 'bg-sky-500 text-white shadow-sm scale-105'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            Sandbox Explorer
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Stars, Trophies, Sound, Help) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Word Book Button */}
          <button
            onClick={() => {
              kidAudio.playPopSound();
              onOpenWordBook();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all"
            title="Word Book"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Book</span>
            <span className="text-[11px] bg-white px-1.5 py-0.2 rounded-full font-bold text-amber-800">
              {discoveredCount}
            </span>
          </button>

          {/* Trophy Album */}
          <button
            onClick={() => {
              kidAudio.playPopSound();
              onOpenStickers();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold transition-all"
            title="Stickers & Trophies"
          >
            <Trophy className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Trophies</span>
          </button>

          {/* Star Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-400/20 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-extrabold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{stars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-xl transition-all ${
              isMuted
                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              kidAudio.playPopSound();
              onOpenHelp();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="How to Play"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
