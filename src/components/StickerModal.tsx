import React from 'react';
import { X, Trophy, Sparkles, Check } from 'lucide-react';
import { StickerBadge } from '../types';
import { kidAudio } from '../utils/audio';

interface StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: StickerBadge[];
  stars: number;
}

export const StickerModal: React.FC<StickerModalProps> = ({
  isOpen,
  onClose,
  badges,
  stars
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-purple-300 shadow-2xl p-5 sm:p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Stickers & Trophies
              </h2>
              <div className="flex items-center gap-2 text-xs text-purple-700 font-medium">
                <span>{badges.filter(b => b.unlocked).length} of {badges.length} Unlocked</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  {stars} Stars
                </span>
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

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {badges.map(badge => {
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                  badge.unlocked
                    ? 'bg-gradient-to-b from-purple-50 to-indigo-50/60 border-purple-200 text-slate-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-300 to-yellow-200 ring-2 ring-purple-300'
                      : 'bg-slate-200'
                  }`}
                >
                  <span aria-hidden="true">{badge.unlocked ? badge.icon : '🔒'}</span>
                </div>

                <div className="w-full">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {badge.desc}
                  </p>
                </div>

                {badge.unlocked ? (
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">
                    Keep Playing to Unlock
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            kidAudio.playPopSound();
            onClose();
          }}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer"
        >
          Back to Playing
        </button>
      </div>
    </div>
  );
};
