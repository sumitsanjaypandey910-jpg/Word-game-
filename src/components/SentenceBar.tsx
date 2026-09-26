import React from 'react';
import { Volume2, Wand2, CheckCircle2, Sparkles } from 'lucide-react';
import { SentenceLevel } from '../types';
import { kidAudio } from '../utils/audio';

interface SentenceBarProps {
  level: SentenceLevel;
  completedWords: string[];
  onTriggerHint: () => void;
  onReadSentence: () => void;
}

export const SentenceBar: React.FC<SentenceBarProps> = ({
  level,
  completedWords,
  onTriggerHint,
  onReadSentence
}) => {
  const isSentenceComplete = level.words.every(w => completedWords.includes(w));
  const nextTargetWord = level.words.find(w => !completedWords.includes(w));

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 rounded-2xl border-2 border-emerald-200/90 p-4 shadow-sm flex flex-col gap-3">
      {/* Header with unboxed metadata */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl select-none" aria-hidden="true">{level.themeEmoji}</span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              Sentence Builder: {level.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700/80 font-medium">
              <span>Connect words to make the complete sentence</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            kidAudio.playHintSound();
            onTriggerHint();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          title="Show hint for next word"
        >
          <Wand2 className="w-4 h-4 text-emerald-700" />
          <span>Hint</span>
        </button>
      </div>

      {/* Next word cue banner */}
      {!isSentenceComplete && nextTargetWord && (
        <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-2 text-xs">
          <span className="text-emerald-900 font-medium">
            Next Word to Connect: <strong className="text-emerald-800 text-sm font-black">{nextTargetWord}</strong>
          </span>
          <button
            onClick={() => kidAudio.speakWord(nextTargetWord)}
            className="p-1 text-emerald-700 hover:text-emerald-900 transition-colors"
            title="Pronounce next word"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* The Sentence Ribbon Display */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-center gap-2">
        {level.words.map((word, idx) => {
          const isDone = completedWords.includes(word);
          const isNext = !isDone && word === nextTargetWord;

          return (
            <div
              key={`${word}_${idx}`}
              onClick={() => {
                if (isDone) kidAudio.speakWord(word);
              }}
              className={`px-3 py-2 rounded-xl font-black text-base sm:text-lg transition-all flex items-center gap-1.5 ${
                isDone
                  ? 'bg-emerald-500 text-white shadow-xs scale-100 cursor-pointer active:scale-95'
                  : isNext
                  ? 'bg-white border-2 border-emerald-400 text-emerald-800 shadow-xs animate-pulse ring-2 ring-emerald-200'
                  : 'bg-white/80 border border-slate-200 text-slate-400'
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>{word}</span>
                </>
              ) : (
                <span>{word}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Sentence Audio & Celebration Action */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onReadSentence}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read Whole Sentence</span>
        </button>

        {isSentenceComplete && (
          <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
};
