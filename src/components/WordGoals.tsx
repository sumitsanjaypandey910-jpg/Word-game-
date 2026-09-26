import React, { useState } from 'react';
import { Volume2, Wand2, Check, Sparkles, Info } from 'lucide-react';
import { WordTarget } from '../types';
import { kidAudio } from '../utils/audio';

interface WordGoalsProps {
  targets: WordTarget[];
  onTriggerHint: () => void;
  levelTitle: string;
  category: string;
  themeEmoji: string;
  remainingHints: number;
}

export const WordGoals: React.FC<WordGoalsProps> = ({
  targets,
  onTriggerHint,
  levelTitle,
  category,
  themeEmoji,
  remainingHints
}) => {
  const [activeFact, setActiveFact] = useState<string | null>(null);

  const foundCount = targets.filter(t => t.found).length;
  const totalCount = targets.length;

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 rounded-2xl border-2 border-amber-200/80 p-4 shadow-sm flex flex-col gap-3">
      {/* Level Header with unboxed metadata */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl select-none" aria-hidden="true">{themeEmoji}</span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              {levelTitle}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-amber-700/80 font-medium">
              <span>{category}</span>
              <span aria-hidden="true">·</span>
              <span>{foundCount} of {totalCount} Words Found</span>
            </div>
          </div>
        </div>

        {/* Magic Hint Wand */}
        <button
          onClick={() => {
            kidAudio.playHintSound();
            onTriggerHint();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          title="Show a letter clue"
        >
          <Wand2 className="w-4 h-4 text-amber-600" />
          <span>Hint</span>
          {remainingHints > 0 && (
            <span className="text-[10px] bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {remainingHints}
            </span>
          )}
        </button>
      </div>

      {/* Target Word Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {targets.map(target => {
          return (
            <div
              key={target.id}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                target.found
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                  : 'bg-amber-50/40 border-amber-200/60 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xl select-none">{target.clueEmoji}</span>
                {target.found ? (
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-800/70">
                    {target.word.length} letters
                  </span>
                )}
              </div>

              <div className="my-1">
                {target.found ? (
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg text-emerald-800 tracking-wider">
                      {target.word}
                    </span>
                    <button
                      onClick={() => kidAudio.speakWord(target.word)}
                      className="p-1 text-emerald-700 hover:text-emerald-900 transition-colors"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 font-mono text-base font-bold text-slate-400">
                    {/* First letter revealed as teaser, rest as underscores */}
                    <span>{target.word[0]}</span>
                    {target.word.slice(1).split('').map((_, i) => (
                      <span key={i} className="inline-block w-3.5 border-b-2 border-slate-300 mx-0.5 text-center">
                        _
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Clue / Fact button */}
              {target.found && target.fact ? (
                <button
                  onClick={() => {
                    kidAudio.playPopSound();
                    setActiveFact(activeFact === target.fact ? null : target.fact || null);
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>Fun Fact!</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 line-clamp-1 italic">
                  {target.hint}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Popover Fun Fact Display */}
      {activeFact && (
        <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Did you know? </span>
            <span>{activeFact}</span>
          </div>
          <button
            onClick={() => setActiveFact(null)}
            className="text-amber-800 font-bold hover:text-amber-950 px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
