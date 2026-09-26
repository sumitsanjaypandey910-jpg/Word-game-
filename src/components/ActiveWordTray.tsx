import React from 'react';
import { Volume2, Check, RotateCcw, X, Sparkles } from 'lucide-react';
import { kidAudio } from '../utils/audio';

interface ActiveWordTrayProps {
  currentWord: string;
  onClear: () => void;
  onUndo: () => void;
  onSubmit: () => void;
  isValidLength: boolean;
}

export const ActiveWordTray: React.FC<ActiveWordTrayProps> = ({
  currentWord,
  onClear,
  onUndo,
  onSubmit,
  isValidLength
}) => {
  const letters = currentWord.split('');

  const handleSpeak = () => {
    if (!currentWord) return;
    kidAudio.spellAndSpeak(currentWord);
  };

  return (
    <div className="w-full max-w-md mx-auto my-3 bg-white/90 backdrop-blur-sm border-2 border-amber-300 rounded-2xl p-3 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Your Word
        </span>

        {currentWord && (
          <div className="flex items-center gap-1.5">
            {/* Speak phonics button */}
            <button
              onClick={handleSpeak}
              className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              title="Hear how it sounds"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Say It</span>
            </button>

            {/* Undo last letter */}
            <button
              onClick={() => {
                kidAudio.playPopSound();
                onUndo();
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
              title="Undo last letter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Clear all */}
            <button
              onClick={() => {
                kidAudio.playPopSound();
                onClear();
              }}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all"
              title="Clear word"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Big letters container */}
      <div className="min-h-14 flex items-center justify-center gap-1.5 p-1 bg-amber-50/60 rounded-xl border border-amber-200/60">
        {letters.length === 0 ? (
          <span className="text-sm font-medium text-amber-800/60 italic select-none">
            Touch or drag letters to connect words...
          </span>
        ) : (
          letters.map((char, index) => (
            <div
              key={`${char}_${index}`}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-b from-amber-400 to-amber-500 text-white font-black text-xl sm:text-2xl rounded-xl flex items-center justify-center shadow-sm animate-bounce"
              style={{ animationDuration: '0.4s', animationIterationCount: 1 }}
            >
              {char}
            </div>
          ))
        )}
      </div>

      {/* Action check button */}
      {currentWord.length >= 2 && (
        <button
          onClick={() => {
            onSubmit();
          }}
          disabled={!isValidLength}
          className={`w-full py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm ${
            isValidLength
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Check "{currentWord}"</span>
        </button>
      )}
    </div>
  );
};
