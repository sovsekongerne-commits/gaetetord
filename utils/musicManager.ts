// Web Audio API Cozy Background Music Synthesizer
// Synthesizes a warm, relaxing, lo-fi style chord loop without external sound files.

interface MusicSettings {
  muted: boolean;
  volume: number; // 0.0 to 1.0
}

const STORAGE_KEY = 'gaetetord_music_settings';

class MusicManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private isMenu = true;
  private stepIndex = 0;
  private loopTimeout: number | null = null;

  private settings: MusicSettings = {
    muted: false,
    volume: 0.7,
  };

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.muted === 'boolean') this.settings.muted = parsed.muted;
        if (typeof parsed.volume === 'number') this.settings.volume = Math.max(0, Math.min(1, parsed.volume));
      }
    } catch {
      // Use defaults if storage fails
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore storage errors
    }
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        
        // Filter for warm, cozy lo-fi tone
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(750, this.audioCtx.currentTime);

        this.masterGain = this.audioCtx.createGain();
        this.updateGain(true);

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private calculateTargetVolume(): number {
    if (this.settings.muted) return 0;
    // Menu is higher (~0.35 max), Game is lower (~0.12 max) for background playability
    const modeMultiplier = this.isMenu ? 0.35 : 0.12;
    return this.settings.volume * modeMultiplier;
  }

  private updateGain(instant = false) {
    if (!this.masterGain || !this.audioCtx) return;
    const target = this.calculateTargetVolume();
    const now = this.audioCtx.currentTime;

    this.masterGain.gain.cancelScheduledValues(now);
    if (instant) {
      this.masterGain.gain.setValueAtTime(target, now);
    } else {
      this.masterGain.gain.linearRampToValueAtTime(target, now + 0.4);
    }
  }

  public setViewState(isMenu: boolean) {
    this.isMenu = isMenu;
    this.updateGain();
    if (!this.isPlaying && !this.settings.muted) {
      this.start();
    }
  }

  public setMuted(muted: boolean) {
    this.settings.muted = muted;
    this.saveSettings();
    this.updateGain();
    if (!muted && !this.isPlaying) {
      this.start();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.settings.muted);
    return this.settings.muted;
  }

  public setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
    this.updateGain();
    if (this.settings.volume > 0 && this.settings.muted) {
      this.setMuted(false);
    }
  }

  public getSettings(): MusicSettings {
    return { ...this.settings };
  }

  public isMuted(): boolean {
    return this.settings.muted;
  }

  public start() {
    this.initAudioContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.stepIndex = 0;
    this.playNextStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.loopTimeout !== null) {
      window.clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
  }

  // Cozy Chord Sequence (Fmaj7 - Cmaj7 - Dm7 - G7)
  private chords = [
    { bass: 174.61, pad: [261.63, 329.63, 440.00], arpeggio: [349.23, 440.00, 523.25, 659.25] }, // F3, C4, E4, A4 / F4, A4, C5, E5
    { bass: 130.81, pad: [261.63, 329.63, 392.00], arpeggio: [261.63, 329.63, 392.00, 493.88] }, // C3, C4, E4, G4 / C4, E4, G4, B4
    { bass: 146.83, pad: [220.00, 261.63, 349.23], arpeggio: [293.66, 349.23, 440.00, 523.25] }, // D3, A3, C4, F4 / D4, F4, A4, C5
    { bass: 196.00, pad: [246.94, 293.66, 349.23], arpeggio: [392.00, 493.88, 587.33, 698.46] }, // G3, B3, D4, F4 / G4, B4, D5, F5
  ];

  private playNextStep = () => {
    if (!this.isPlaying || !this.audioCtx || !this.filterNode) return;

    const chordIndex = Math.floor(this.stepIndex / 8) % this.chords.length;
    const beatIndex = this.stepIndex % 8;
    const currentChord = this.chords[chordIndex];
    const now = this.audioCtx.currentTime;
    const beatDuration = 0.35; // ~85 BPM (8th notes)

    // Play Warm Pad on bar start (beat 0)
    if (beatIndex === 0) {
      currentChord.pad.forEach((freq) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + beatDuration * 7.5);

        osc.connect(gain);
        gain.connect(this.filterNode!);

        osc.start(now);
        osc.stop(now + beatDuration * 7.8);
      });

      // Soft Sub-bass
      const bassOsc = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();

      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(currentChord.bass / 2, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + beatDuration * 7.5);

      bassOsc.connect(bassGain);
      bassGain.connect(this.filterNode);

      bassOsc.start(now);
      bassOsc.stop(now + beatDuration * 7.8);
    }

    // Play gentle arpeggio notes on certain beats (relaxing rhythm)
    if ([0, 2, 3, 5, 6, 7].includes(beatIndex)) {
      const arpNote = currentChord.arpeggio[beatIndex % currentChord.arpeggio.length];
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(arpNote, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + 0.5);
    }

    this.stepIndex++;
    this.loopTimeout = window.setTimeout(this.playNextStep, beatDuration * 1000);
  };
}

export const musicManager = new MusicManager();
