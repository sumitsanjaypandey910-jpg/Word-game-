// Kid-friendly Web Audio synthesizer and Speech Synthesis helper

class KidAudioService {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private synthAvailable: boolean = typeof window !== 'undefined' && 'speechSynthesis' in window;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Musical note frequency table for pentatonic/cheerful scale (C4 to C6)
  private scaleFrequencies = [
    261.63, // C4 (Letter 1)
    293.66, // D4 (Letter 2)
    329.63, // E4 (Letter 3)
    349.23, // F4 (Letter 4)
    392.00, // G4 (Letter 5)
    440.00, // A4 (Letter 6)
    493.88, // B4 (Letter 7)
    523.25, // C5 (Letter 8)
    587.33, // D5 (Letter 9)
    659.25, // E5 (Letter 10)
    783.99, // G5 (Letter 11)
    1046.50 // C6 (Letter 12)
  ];

  // Play a warm marimba/xylophone bell tone as letters are connected
  public playLetterTone(stepIndex: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freq = this.scaleFrequencies[Math.min(stepIndex, this.scaleFrequencies.length - 1)];
      const now = this.ctx.currentTime;

      // Primary tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Subtle second harmonic for warm xylophone resonance
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Fast percussive attack, soft ring
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.38);
      osc2.stop(now + 0.22);
    } catch {
      // Audio fallback gracefully
    }
  }

  // Triumphant cheerful chime for finding a word
  public playWordSuccessSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch {
      // ignore
    }
  }

  // Big sentence completion fanfare
  public playSentenceVictorySound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High celebratory fanfare: G4, C5, E5, G5 with sustained glow
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.26, now + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.7);
      });
    } catch {
      // ignore
    }
  }

  // Gentle, soft, non-punishing "try again" sound
  public playOopsSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  // Magic wand / hint twinkle
  public playHintSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const harpNotes = [659.25, 783.99, 987.77, 1174.66, 1318.51];

      harpNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Button click bubble pop
  public playPopSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Speak a word clearly using Web Speech API with upbeat kid voice
  public speakWord(word: string) {
    if (this.isMuted || !this.synthAvailable) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
      utterance.rate = 0.88; // slightly slower for young learners
      utterance.pitch = 1.15; // friendly, upbeat pitch
      utterance.lang = 'en-US';

      // Pick clear female or cheerful voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Junior')));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore speech errors
    }
  }

  // Spell out letters then speak the full word: "C... A... T... CAT!"
  public spellAndSpeak(word: string) {
    if (this.isMuted || !this.synthAvailable) return;
    try {
      window.speechSynthesis.cancel();
      const clean = word.trim().toUpperCase();
      const letters = clean.split('').join('. ');
      const phrase = `${letters}. ... ${word}!`;

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.85;
      utterance.pitch = 1.15;
      utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  // Speak a full sentence
  public speakSentence(sentence: string) {
    if (this.isMuted || !this.synthAvailable) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.synthAvailable) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }
}

export const kidAudio = new KidAudioService();
