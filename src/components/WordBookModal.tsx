import React from 'react';
import { X, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { DiscoveredWord } from '../types';
import { kidAudio } from '../utils/audio';

interface WordBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: DiscoveredWord[];
}

export const WordBookModal: React.FC<WordBookModalProps> = ({
  isOpen,
  onClose,
  words
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-5 sm:p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-black text-slate-800">
                My Word Discovery Book
              </h2>
              <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                <span>{words.length} Words Collected</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              kidAudio.playPopSound();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word List */}
        {words.length === 0 ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <Sparkles className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="font-bold text-sm text-slate-700">No bonus words yet!</p>
            <p className="text-xs max-w-xs text-slate-500">
              Connect letters on the screen in Sandbox Explorer or level puzzles to discover hidden English words and collect them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {words.map((item, idx) => (
              <div
                key={`${item.word}_${idx}`}
                className="p-3 bg-amber-50/50 hover:bg-amber-100/50 border border-amber-200 rounded-2xl flex items-start justify-between gap-2 transition-all shadow-2xs"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl select-none" aria-hidden="true">
                    {item.emoji || '⭐'}
                  </span>
                  <div>
                    <h4 className="font-black text-base text-slate-800 tracking-wide">
                      {item.word}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      {item.meaning}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    kidAudio.speakWord(item.word);
                  }}
                  className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-200/60 rounded-lg transition-colors shrink-0"
                  title="Speak word"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => {
            kidAudio.playPopSound();
            onClose();
          }}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer"
        >
          Close Book
        </button>
      </div>
    </div>
  );
};
