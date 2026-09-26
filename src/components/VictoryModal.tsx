import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import { kidAudio } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  themeEmoji: string;
  wordsLearned: string[];
  starsAwarded: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onClose: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  title,
  subtitle,
  themeEmoji,
  wordsLearned,
  starsAwarded,
  onNextLevel,
  onReplay,
  onClose,
  hasNextLevel
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire playful confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 text-center flex flex-col items-center gap-4">
        {/* Decorative Badge */}
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white -mt-12 animate-bounce">
          <span aria-hidden="true">{themeEmoji || '🌟'}</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {title}
          </h2>
          <p className="text-sm font-medium text-amber-800/80 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Stars Awarded */}
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="text-base font-extrabold text-amber-900">
            +{starsAwarded} Stars Earned!
          </span>
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>

        {/* Words Learned Shelf */}
        <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Words You Mastered:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {wordsLearned.map(word => (
              <button
                key={word}
                onClick={() => {
                  kidAudio.playLetterTone(0);
                  kidAudio.speakWord(word);
                }}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <span>{word}</span>
                <Volume2 className="w-3 h-3 text-amber-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              kidAudio.playPopSound();
              onReplay();
            }}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          {hasNextLevel ? (
            <button
              onClick={() => {
                kidAudio.playPopSound();
                onNextLevel();
              }}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-98"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                kidAudio.playPopSound();
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-98"
            >
              <span>You Did It!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
