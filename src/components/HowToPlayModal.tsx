import React from 'react';
import { X, Hand, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { kidAudio } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎮</span>
            <h2 className="text-xl font-black text-slate-800">
              How to Play WordSparks
            </h2>
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

        {/* Step-by-step playful cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">1. Drag or Tap Letters</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Drag your finger or mouse across adjacent letters to connect them into a word path. You can also tap letter by letter!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 text-emerald-950 font-black flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">2. Listen & Learn Phonics</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Hear musical chimes as you connect! Tap "Say It" to hear letter sounds and word pronunciations out loud.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-purple-400 text-purple-950 font-black flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800">3. Words & Sentences</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                In <strong>Word Quest</strong>, find all target words! In <strong>Sentence Builder</strong>, connect words in order to construct real sentences and unlock story stickers!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            kidAudio.playPopSound();
            onClose();
          }}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm transition-all shadow-md cursor-pointer active:scale-98"
        >
          Let's Play! 🌟
        </button>
      </div>
    </div>
  );
};
