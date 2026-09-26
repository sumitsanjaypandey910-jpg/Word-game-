import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameMode, WordTarget, DiscoveredWord, StickerBadge } from './types';
import { WORD_LEVELS, SENTENCE_LEVELS, STICKER_BADGES, generateRandomSoup } from './data/levels';
import { lookupKidWord } from './data/dictionary';
import { kidAudio } from './utils/audio';
import { TopNav } from './components/TopNav';
import { AlphabetCanvas, GridCell } from './components/AlphabetCanvas';
import { ActiveWordTray } from './components/ActiveWordTray';
import { WordGoals } from './components/WordGoals';
import { SentenceBar } from './components/SentenceBar';
import { VictoryModal } from './components/VictoryModal';
import { StickerModal } from './components/StickerModal';
import { WordBookModal } from './components/WordBookModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

import mascotImg from './assets/images/kids_word_mascot_1790438152942.jpg';
import bannerImg from './assets/images/kids_word_adventure_banner_1790438181441.jpg';

export default function App() {
  // Modes & Levels State
  const [currentMode, setCurrentMode] = useState<GameMode>('WORDS');
  const [wordLevelIndex, setWordLevelIndex] = useState(0);
  const [sentenceLevelIndex, setSentenceLevelIndex] = useState(0);

  // Targets & Progress
  const [wordTargets, setWordTargets] = useState<WordTarget[]>(() => {
    return WORD_LEVELS[0].targets.map(t => ({ ...t, found: false }));
  });
  const [sentenceCompletedWords, setSentenceCompletedWords] = useState<string[]>([]);
  const [explorerSoup, setExplorerSoup] = useState<string[][]>(() => generateRandomSoup());

  // Connection State
  const [activeChain, setActiveChain] = useState<GridCell[]>([]);
  const activeWord = useMemo(() => activeChain.map(c => c.letter).join(''), [activeChain]);

  // Hints & Stats
  const [hintCellId, setHintCellId] = useState<string | null>(null);
  const [remainingHints, setRemainingHints] = useState(3);
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('wordsparks_stars');
    return saved ? parseInt(saved, 10) : 5; // starter gift of 5 stars
  });

  const [discoveredWords, setDiscoveredWords] = useState<DiscoveredWord[]>(() => {
    const saved = localStorage.getItem('wordsparks_discovered_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState<StickerBadge[]>(() => {
    const saved = localStorage.getItem('wordsparks_badges');
    return saved ? JSON.parse(saved) : STICKER_BADGES;
  });

  // UI Modals & Notification
  const [isMuted, setIsMuted] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isStickersOpen, setIsStickersOpen] = useState(false);
  const [isWordBookOpen, setIsWordBookOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);

  // Current Level Objects
  const currentWordLevel = WORD_LEVELS[wordLevelIndex] || WORD_LEVELS[0];
  const currentSentenceLevel = SENTENCE_LEVELS[sentenceLevelIndex] || SENTENCE_LEVELS[0];

  // Save persistent state
  useEffect(() => {
    localStorage.setItem('wordsparks_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('wordsparks_discovered_words', JSON.stringify(discoveredWords));
  }, [discoveredWords]);

  useEffect(() => {
    localStorage.setItem('wordsparks_badges', JSON.stringify(badges));
  }, [badges]);

  // Change Word Level
  const loadWordLevel = useCallback((lvlIndex: number) => {
    const safeIdx = Math.max(0, Math.min(lvlIndex, WORD_LEVELS.length - 1));
    setWordLevelIndex(safeIdx);
    setWordTargets(WORD_LEVELS[safeIdx].targets.map(t => ({ ...t, found: false })));
    setActiveChain([]);
    setHintCellId(null);
    setRemainingHints(3);
  }, []);

  // Change Sentence Level
  const loadSentenceLevel = useCallback((lvlIndex: number) => {
    const safeIdx = Math.max(0, Math.min(lvlIndex, SENTENCE_LEVELS.length - 1));
    setSentenceLevelIndex(safeIdx);
    setSentenceCompletedWords([]);
    setActiveChain([]);
    setHintCellId(null);
  }, []);

  // Show Toast Helper
  const showToast = useCallback((message: string, emoji: string = '✨') => {
    setToast({ message, emoji });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  // Check Badge Unlock criteria
  const checkBadgeUnlocks = useCallback((newStars: number, newDiscCount: number) => {
    setBadges(prev =>
      prev.map(badge => {
        if (badge.unlocked) return badge;
        if (badge.id === 'badge_star_collector' && newStars >= 20) {
          showToast('New Trophy Unlocked: Star Wizard! 🏆', '⭐');
          return { ...badge, unlocked: true };
        }
        if (badge.id === 'badge_word_detective' && newDiscCount >= 10) {
          showToast('New Trophy Unlocked: Word Detective! 🔍', '🔍');
          return { ...badge, unlocked: true };
        }
        return badge;
      })
    );
  }, [showToast]);

  // Word Submission Logic
  const handleCheckWord = useCallback(() => {
    if (!activeWord || activeWord.length < 2) return;
    const submitted = activeWord.toUpperCase();

    if (currentMode === 'WORDS') {
      const matchTarget = wordTargets.find(t => t.word === submitted);

      if (matchTarget) {
        if (matchTarget.found) {
          kidAudio.playLetterTone(0);
          showToast(`You already found ${submitted}!`, '👍');
          setActiveChain([]);
          return;
        }

        // Target found!
        kidAudio.playWordSuccessSound();
        kidAudio.speakWord(submitted);
        setStars(s => {
          const updated = s + 3;
          checkBadgeUnlocks(updated, discoveredWords.length);
          return updated;
        });

        const updatedTargets = wordTargets.map(t =>
          t.id === matchTarget.id ? { ...t, found: true } : t
        );
        setWordTargets(updatedTargets);
        showToast(`Awesome! You found "${submitted}"!`, matchTarget.clueEmoji);
        setActiveChain([]);

        // Check if all targets are found
        const remaining = updatedTargets.filter(t => !t.found).length;
        if (remaining === 0) {
          // Unlock pet whisperer or rainbow master badges if applicable
          if (wordLevelIndex === 0) {
            setBadges(prev => prev.map(b => b.id === 'badge_pet_whisperer' ? { ...b, unlocked: true } : b));
          }
          if (wordLevelIndex === 4) {
            setBadges(prev => prev.map(b => b.id === 'badge_rainbow_master' ? { ...b, unlocked: true } : b));
          }

          setTimeout(() => {
            setStars(s => s + 5);
            setIsVictoryModalOpen(true);
            kidAudio.playSentenceVictorySound();
          }, 450);
        }
        return;
      }

      // Check if it's a bonus dictionary word
      const bonusDef = lookupKidWord(submitted);
      if (bonusDef) {
        kidAudio.playWordSuccessSound();
        kidAudio.speakWord(submitted);
        setStars(s => {
          const updated = s + 2;
          checkBadgeUnlocks(updated, discoveredWords.length + 1);
          return updated;
        });

        // Add to discovered words if new
        if (!discoveredWords.some(d => d.word === submitted)) {
          setDiscoveredWords(prev => [
            {
              word: submitted,
              meaning: bonusDef.meaning,
              emoji: bonusDef.emoji,
              discoveredAt: Date.now()
            },
            ...prev
          ]);
        }
        showToast(`Bonus Word Found: "${submitted}"!`, bonusDef.emoji);
        setActiveChain([]);
        return;
      }

      // Neither target nor dictionary word
      kidAudio.playOopsSound();
      showToast(`Keep searching! Try another word.`, '🌱');
      setActiveChain([]);
    } else if (currentMode === 'SENTENCES') {
      const targetWords = currentSentenceLevel.words;
      const isWordInSentence = targetWords.includes(submitted);

      if (isWordInSentence) {
        if (sentenceCompletedWords.includes(submitted)) {
          kidAudio.playLetterTone(0);
          showToast(`"${submitted}" is already in your sentence!`, '✨');
          setActiveChain([]);
          return;
        }

        // Word matches in sentence!
        kidAudio.playWordSuccessSound();
        kidAudio.speakWord(submitted);
        const newCompleted = [...sentenceCompletedWords, submitted];
        setSentenceCompletedWords(newCompleted);

        setStars(s => {
          const updated = s + 3;
          checkBadgeUnlocks(updated, discoveredWords.length);
          return updated;
        });

        showToast(`Great! Connected "${submitted}"!`, '📜');
        setActiveChain([]);

        // Check if all words in sentence are connected
        const allDone = targetWords.every(w => newCompleted.includes(w));
        if (allDone) {
          // Unlock sentence champion badge
          setBadges(prev => prev.map(b => b.id === 'badge_sentence_star' ? { ...b, unlocked: true } : b));
          setTimeout(() => {
            setStars(s => s + 5);
            kidAudio.playSentenceVictorySound();
            kidAudio.speakSentence(currentSentenceLevel.fullSentence);
            setIsVictoryModalOpen(true);
          }, 600);
        }
        return;
      }

      // Bonus word in sentence mode
      const bonusDef = lookupKidWord(submitted);
      if (bonusDef) {
        kidAudio.playWordSuccessSound();
        kidAudio.speakWord(submitted);
        setStars(s => s + 1);
        if (!discoveredWords.some(d => d.word === submitted)) {
          setDiscoveredWords(prev => [
            {
              word: submitted,
              meaning: bonusDef.meaning,
              emoji: bonusDef.emoji,
              discoveredAt: Date.now()
            },
            ...prev
          ]);
        }
        showToast(`Bonus Word: "${submitted}"!`, bonusDef.emoji);
        setActiveChain([]);
        return;
      }

      kidAudio.playOopsSound();
      showToast(`Not in this sentence. Look for the next word!`, '🔎');
      setActiveChain([]);
    } else {
      // Sandbox Explorer Mode
      const def = lookupKidWord(submitted);
      if (def) {
        kidAudio.playWordSuccessSound();
        kidAudio.speakWord(submitted);
        setStars(s => {
          const updated = s + 2;
          checkBadgeUnlocks(updated, discoveredWords.length + 1);
          return updated;
        });

        if (!discoveredWords.some(d => d.word === submitted)) {
          setDiscoveredWords(prev => [
            {
              word: submitted,
              meaning: def.meaning,
              emoji: def.emoji,
              discoveredAt: Date.now()
            },
            ...prev
          ]);
        }
        showToast(`Discovered "${submitted}"! ${def.meaning}`, def.emoji);
        setActiveChain([]);
      } else {
        kidAudio.playOopsSound();
        showToast(`Try connecting another word!`, '🌟');
        setActiveChain([]);
      }
    }
  }, [
    activeWord,
    currentMode,
    wordTargets,
    sentenceCompletedWords,
    currentSentenceLevel,
    discoveredWords,
    wordLevelIndex,
    checkBadgeUnlocks,
    showToast
  ]);

  // Trigger Hint: finds the first letter of an unfound word on the board
  const handleTriggerHint = () => {
    if (currentMode === 'WORDS') {
      const unfound = wordTargets.find(t => !t.found);
      if (!unfound) return;

      const firstChar = unfound.word[0];
      const grid = currentWordLevel.boardLetters;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c] === firstChar) {
            const cellId = `cell_${r}_${c}`;
            setHintCellId(cellId);
            kidAudio.speakWord(`Find the letter ${firstChar} for ${unfound.word}`);
            showToast(`Look for ${firstChar} to start "${unfound.word}"!`, unfound.clueEmoji);
            setTimeout(() => setHintCellId(null), 4000);
            return;
          }
        }
      }
    } else if (currentMode === 'SENTENCES') {
      const nextWord = currentSentenceLevel.words.find(w => !sentenceCompletedWords.includes(w));
      if (!nextWord) return;

      const firstChar = nextWord[0];
      const grid = currentSentenceLevel.boardLetters;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c] === firstChar) {
            const cellId = `cell_${r}_${c}`;
            setHintCellId(cellId);
            kidAudio.speakWord(`Look for "${nextWord}" starting with ${firstChar}`);
            showToast(`Start with letter "${firstChar}" for "${nextWord}"!`, '💡');
            setTimeout(() => setHintCellId(null), 4000);
            return;
          }
        }
      }
    }
  };

  // Next level handler
  const handleNextLevel = () => {
    setIsVictoryModalOpen(false);
    if (currentMode === 'WORDS') {
      if (wordLevelIndex < WORD_LEVELS.length - 1) {
        loadWordLevel(wordLevelIndex + 1);
      }
    } else if (currentMode === 'SENTENCES') {
      if (sentenceLevelIndex < SENTENCE_LEVELS.length - 1) {
        loadSentenceLevel(sentenceLevelIndex + 1);
      }
    }
  };

  const currentBoardLetters = useMemo(() => {
    if (currentMode === 'WORDS') return currentWordLevel.boardLetters;
    if (currentMode === 'SENTENCES') return currentSentenceLevel.boardLetters;
    return explorerSoup;
  }, [currentMode, currentWordLevel, currentSentenceLevel, explorerSoup]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-yellow-50/60 flex flex-col font-sans">
      {/* Top Navigation */}
      <TopNav
        currentMode={currentMode}
        onSelectMode={mode => {
          setCurrentMode(mode);
          setActiveChain([]);
          setHintCellId(null);
        }}
        stars={stars}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = kidAudio.toggleMute();
          setIsMuted(muted);
        }}
        onOpenStickers={() => setIsStickersOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenWordBook={() => setIsWordBookOpen(true)}
        discoveredCount={discoveredWords.length}
      />

      {/* Hero / Adventure Banner */}
      <div className="relative w-full max-w-6xl mx-auto px-4 mt-3 mb-2">
        <div className="relative h-24 sm:h-32 rounded-3xl overflow-hidden shadow-sm border-2 border-amber-200/90 flex items-center justify-between px-4 sm:px-8">
          <img
            src={bannerImg}
            alt="WordSparks Adventure Banner"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/65 via-amber-900/40 to-transparent" />

          {/* Banner Text */}
          <div className="relative z-10 text-white max-w-md">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-200 block">
              {currentMode === 'WORDS' ? 'Word Quest Adventure' : currentMode === 'SENTENCES' ? 'Sentence Builder Challenge' : 'Sandbox Word Discovery'}
            </span>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight drop-shadow-sm text-balance">
              {currentMode === 'WORDS'
                ? `Level ${wordLevelIndex + 1}: ${currentWordLevel.title}`
                : currentMode === 'SENTENCES'
                ? `Sentence ${sentenceLevelIndex + 1}: ${currentSentenceLevel.title}`
                : 'Free Alphabet Playground'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium line-clamp-1">
              {currentMode === 'WORDS'
                ? currentWordLevel.description
                : currentMode === 'SENTENCES'
                ? currentSentenceLevel.hint
                : 'Connect any letters to discover hidden English words!'}
            </p>
          </div>

          {/* Cheerful Mascot on Banner */}
          <div className="relative z-10 hidden sm:flex items-center gap-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              <img
                src={mascotImg}
                alt="Ollie the Owl Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-2 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Word Goals or Sentence Bar */}
        <section className="lg:col-span-5 flex flex-col gap-3 order-2 lg:order-1">
          {currentMode === 'WORDS' && (
            <WordGoals
              targets={wordTargets}
              onTriggerHint={handleTriggerHint}
              levelTitle={currentWordLevel.title}
              category={currentWordLevel.category}
              themeEmoji={currentWordLevel.themeEmoji}
              remainingHints={remainingHints}
            />
          )}

          {currentMode === 'SENTENCES' && (
            <SentenceBar
              level={currentSentenceLevel}
              completedWords={sentenceCompletedWords}
              onTriggerHint={handleTriggerHint}
              onReadSentence={() => {
                kidAudio.speakSentence(currentSentenceLevel.fullSentence);
              }}
            />
          )}

          {currentMode === 'EXPLORER' && (
            <div className="w-full max-w-md mx-auto bg-white/95 rounded-2xl border-2 border-sky-200 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl select-none" aria-hidden="true">🧭</span>
                  <div>
                    <h2 className="text-base font-black text-slate-800">
                      Alphabet Sandbox
                    </h2>
                    <span className="text-xs text-sky-700">Find any real English word</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    kidAudio.playPopSound();
                    setExplorerSoup(generateRandomSoup());
                    setActiveChain([]);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-xl text-xs font-bold transition-all shadow-2xs"
                  title="Mix up new letters"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>New Letters</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Trace or tap letters in any direction. Discover bonus words to earn stars and fill your <strong>Word Discovery Book</strong>!
              </p>

              {/* Quick sample words discovered */}
              <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/70">
                <span className="text-[11px] font-bold text-sky-800 uppercase block mb-1">
                  Recently Discovered ({discoveredWords.length}):
                </span>
                {discoveredWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No discoveries yet! Trace a word like "CAT" or "SUN".</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {discoveredWords.slice(0, 6).map(w => (
                      <span
                        key={w.word}
                        className="px-2 py-0.5 bg-white border border-sky-200 rounded-lg text-xs font-bold text-sky-900 shadow-2xs"
                      >
                        {w.emoji} {w.word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level Switcher Navigation */}
          <div className="w-full max-w-md mx-auto bg-white/80 border border-amber-200 rounded-2xl p-2.5 flex items-center justify-between shadow-2xs">
            <button
              onClick={() => {
                kidAudio.playPopSound();
                if (currentMode === 'WORDS') {
                  loadWordLevel(wordLevelIndex - 1);
                } else if (currentMode === 'SENTENCES') {
                  loadSentenceLevel(sentenceLevelIndex - 1);
                }
              }}
              disabled={currentMode === 'WORDS' ? wordLevelIndex === 0 : sentenceLevelIndex === 0}
              className="p-2 rounded-xl text-slate-700 hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Previous Puzzle"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-extrabold text-amber-900">
              {currentMode === 'WORDS'
                ? `Puzzle ${wordLevelIndex + 1} of ${WORD_LEVELS.length}`
                : currentMode === 'SENTENCES'
                ? `Sentence ${sentenceLevelIndex + 1} of ${SENTENCE_LEVELS.length}`
                : 'Infinite Alphabet Soup'}
            </span>

            <button
              onClick={() => {
                kidAudio.playPopSound();
                if (currentMode === 'WORDS') {
                  loadWordLevel(wordLevelIndex + 1);
                } else if (currentMode === 'SENTENCES') {
                  loadSentenceLevel(sentenceLevelIndex + 1);
                }
              }}
              disabled={
                currentMode === 'WORDS'
                  ? wordLevelIndex === WORD_LEVELS.length - 1
                  : sentenceLevelIndex === SENTENCE_LEVELS.length - 1
              }
              className="p-2 rounded-xl text-slate-700 hover:bg-amber-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Next Puzzle"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Right Column: Active Canvas & Active Tray */}
        <section className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2">
          {/* Active Word Preview Tray */}
          <ActiveWordTray
            currentWord={activeWord}
            onClear={() => {
              setActiveChain([]);
            }}
            onUndo={() => {
              setActiveChain(prev => prev.slice(0, -1));
            }}
            onSubmit={handleCheckWord}
            isValidLength={activeWord.length >= 2}
          />

          {/* Interactive Alphabet Canvas */}
          <AlphabetCanvas
            boardLetters={currentBoardLetters}
            activeWord={activeWord}
            onLetterChainChange={chain => {
              setActiveChain(chain);
            }}
            onSubmitWord={() => {
              handleCheckWord();
            }}
            hintCellId={hintCellId}
          />
        </section>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-xl border border-amber-300 flex items-center gap-2 animate-bounce">
          <span className="text-xl select-none" aria-hidden="true">{toast.emoji}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        title={currentMode === 'SENTENCES' ? 'Sentence Complete!' : 'Puzzle Solved!'}
        subtitle={
          currentMode === 'SENTENCES'
            ? `You built "${currentSentenceLevel.fullSentence}"!`
            : `You found all words in ${currentWordLevel.title}!`
        }
        themeEmoji={currentMode === 'SENTENCES' ? currentSentenceLevel.themeEmoji : currentWordLevel.themeEmoji}
        wordsLearned={
          currentMode === 'SENTENCES'
            ? currentSentenceLevel.words
            : currentWordLevel.targets.map(t => t.word)
        }
        starsAwarded={5}
        onNextLevel={handleNextLevel}
        onReplay={() => {
          setIsVictoryModalOpen(false);
          if (currentMode === 'WORDS') loadWordLevel(wordLevelIndex);
          if (currentMode === 'SENTENCES') loadSentenceLevel(sentenceLevelIndex);
        }}
        onClose={() => setIsVictoryModalOpen(false)}
        hasNextLevel={
          currentMode === 'WORDS'
            ? wordLevelIndex < WORD_LEVELS.length - 1
            : sentenceLevelIndex < SENTENCE_LEVELS.length - 1
        }
      />

      {/* Trophies & Stickers Modal */}
      <StickerModal
        isOpen={isStickersOpen}
        onClose={() => setIsStickersOpen(false)}
        badges={badges}
        stars={stars}
      />

      {/* Word Discovery Book Modal */}
      <WordBookModal
        isOpen={isWordBookOpen}
        onClose={() => setIsWordBookOpen(false)}
        words={discoveredWords}
      />

      {/* How to Play Guide Modal */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
