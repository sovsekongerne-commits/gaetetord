import React, { useEffect, useState, useRef } from 'react';
import { GameMode, Language, WordCard, GameSettings } from '../types';
import { WORD_LIST, GAME_DURATION_SECONDS, AUDIO_ALERT_THRESHOLD } from '../constants';
import { GameCard } from './GameCard';
import { playBeep } from '../utils/audio';
import { Check, ArrowRight, Pause, Play, Clock, Users, Monitor, ScanFace } from 'lucide-react';

interface GameScreenProps {
  settings: GameSettings;
  onEndGame: (total: number) => void;
  onExit: () => void;
}

type GamePhase = 'instructions' | 'ready' | 'countdown' | 'playing';

export const GameScreen: React.FC<GameScreenProps> = ({ settings, onEndGame, onExit }) => {
  const [deck, setDeck] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [isPaused, setIsPaused] = useState(false);
  
  // New states for start sequence
  const [gamePhase, setGamePhase] = useState<GamePhase>('instructions');
  const [startCountdown, setStartCountdown] = useState(5);

  const timerRef = useRef<number | null>(null);

  // Initialize Deck
  useEffect(() => {
    // Shuffle and slice deck to the card limit immediately
    const shuffled = [...WORD_LIST];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled.slice(0, settings.cardLimit));
  }, [settings.cardLimit]);

  // Handle Ready Phase Transition
  useEffect(() => {
    if (gamePhase === 'ready') {
        const readyTimer = setTimeout(() => {
            setGamePhase('countdown');
        }, 1500); // Show "Ready" for 1.5s
        return () => clearTimeout(readyTimer);
    }
  }, [gamePhase]);

  // Handle Start Countdown (5...4...3...)
  useEffect(() => {
    if (gamePhase === 'countdown') {
        const interval = setInterval(() => {
            setStartCountdown((prev) => {
                if (prev <= 1) {
                    playBeep('success'); // High pitch go!
                    setGamePhase('playing');
                    return 0;
                }
                playBeep('tick'); // Metronome tick
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }
  }, [gamePhase]);

  // Handle Game Timer (Per Card)
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    
    // When time runs out, we just beep, we don't end the game automatically, 
    // the teacher must press next.
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= AUDIO_ALERT_THRESHOLD + 1 && prev > 1) playBeep('tick');
          if (prev === 1) playBeep('end');
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused, gamePhase]);

  const handleNext = () => {
    if (gamePhase !== 'playing') return;

    playBeep('success');
    
    const nextIndex = currentIndex + 1;
    
    // Check if we have reached the limit
    if (nextIndex >= settings.cardLimit || nextIndex >= deck.length) {
        onEndGame(settings.cardLimit);
    } else {
        setCurrentIndex(nextIndex);
        setTimeLeft(settings.duration); // Reset timer for next card
    }
  };

  const getInstruction = () => {
    const lang = settings.language;
    switch (settings.mode) {
      case GameMode.MIME: return lang === Language.DA ? 'MIME DET!' : 'MIME IT!';
      case GameMode.EXPLAIN: return lang === Language.DA ? 'FORKLAR DET!' : 'EXPLAIN IT!';
      case GameMode.SILENT: return lang === Language.DA ? 'LYDLØST!' : 'SILENTLY!';
      default: return '';
    }
  };

  const getFullInstructionText = () => {
      const lang = settings.language;
      switch (settings.mode) {
          case GameMode.MIME: 
            return lang === Language.DA 
                ? 'Brug kroppen til at vise ordet. Ingen lyde!' 
                : 'Use your body to show the word. No sounds!';
          case GameMode.EXPLAIN: 
            return lang === Language.DA 
                ? 'Forklar ordet uden at sige selve ordet!' 
                : 'Explain the word without saying the word itself!';
          case GameMode.SILENT: 
            return lang === Language.DA 
                ? 'Sig ordet tydeligt uden lyd. De andre skal mundaflæse!' 
                : 'Mouth the word clearly without sound. Others must lip-read!';
          default: return '';
      }
  };

  if (deck.length === 0) return <div className="text-white font-bold text-2xl">Loading...</div>;

  const currentCard = deck[currentIndex];
  const isDa = settings.language === Language.DA;

  // Dynamic background based on timer urgency
  const bgColorClass = timeLeft <= 5 && timeLeft > 0
    ? 'bg-[#ef4444]' // Red Alert
    : timeLeft === 0
        ? 'bg-slate-700' // Time out
        : timeLeft <= 15 
            ? 'bg-[#f59e0b]' // Amber
            : 'bg-[#0ea5e9]'; // Sky Blue

  const timerColorClass = timeLeft <= 10 ? 'text-red-600 border-red-200 animate-pulse-fast' : 'text-slate-800 border-slate-200';

  return (
    <div className={`flex flex-col h-screen ${bgColorClass} transition-colors duration-1000 relative overflow-hidden`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-wiggle" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/5 rounded-full blur-3xl" />
        </div>

        {/* --- INSTRUCTION OVERLAY --- */}
        {gamePhase === 'instructions' && (
            <div 
                onClick={() => setGamePhase('ready')}
                className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer animate-fade-in"
            >
                <div className="bg-white text-slate-900 max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-[8px] border-yellow-400 flex flex-col items-center text-center animate-pop relative overflow-hidden group">
                    
                    {/* Floating decoration */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-xl opacity-50"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-xl opacity-50"></div>

                    <h2 className="text-4xl md:text-5xl font-black text-[#0ea5e9] mb-8 uppercase tracking-tight relative z-10">
                        {isDa ? 'Sådan spiller I' : 'How to play'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full relative z-10">
                        <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-100 flex flex-col items-center gap-3">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <Users size={40} className="text-[#0ea5e9]" />
                            </div>
                            <h3 className="font-black text-xl">{isDa ? 'Lav makkerpar' : 'Make pairs'}</h3>
                            <p className="text-slate-600 font-medium leading-tight">
                                {isDa ? 'Stil jer overfor hinanden.' : 'Stand facing each other.'}
                            </p>
                        </div>
                        <div className="bg-pink-50 p-6 rounded-3xl border-4 border-pink-100 flex flex-col items-center gap-3">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <ScanFace size={40} className="text-pink-500" />
                            </div>
                            <h3 className="font-black text-xl">{isDa ? 'Ryg til skærmen' : 'Back to screen'}</h3>
                            <p className="text-slate-600 font-medium leading-tight">
                                {isDa ? 'Den der gætter, må ikke se skærmen!' : 'The guesser cannot look at the screen!'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 w-full p-6 rounded-3xl border-4 border-yellow-200 mb-10 relative z-10">
                         <h3 className="font-black text-xl mb-2 uppercase text-yellow-600">{isDa ? 'Opgaven' : 'The Mission'}</h3>
                         <p className="text-xl md:text-2xl font-bold text-slate-800">
                            {getFullInstructionText()}
                         </p>
                    </div>

                    <div className="animate-bounce text-slate-400 font-bold uppercase tracking-widest text-sm md:text-base">
                        {isDa ? 'Klik hvor som helst for at starte' : 'Click anywhere to start'}
                    </div>
                </div>
            </div>
        )}

        {/* --- START SEQUENCE OVERLAY (READY / COUNTDOWN) --- */}
        {(gamePhase === 'ready' || gamePhase === 'countdown') && (
            <div className="absolute inset-0 z-[60] bg-[#38bdf8] flex items-center justify-center flex-col animate-fade-in">
                {gamePhase === 'ready' && (
                    <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-xl animate-pop text-center p-4">
                        {settings.language === Language.DA ? 'Er I klar?' : 'Are you ready?'}
                    </h1>
                )}
                {gamePhase === 'countdown' && (
                    <div className="animate-pop">
                        <span className="text-[15rem] md:text-[20rem] font-black text-white drop-shadow-2xl leading-none">
                            {startCountdown}
                        </span>
                    </div>
                )}
            </div>
        )}

        {/* Header HUD */}
        <div className="flex items-center justify-between p-4 z-20">
            <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl backdrop-blur-md transition-all active:scale-95"
            >
                {isPaused ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
            </button>
            
            <div className="flex flex-col items-center">
                <div className="bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm border-2 border-white/10 flex items-center gap-3">
                    <span className="text-white font-black tracking-wider text-lg shadow-black drop-shadow-md">
                        {currentIndex + 1} / {settings.cardLimit}
                    </span>
                    <div className="w-1 h-4 bg-white/30 rounded-full"></div>
                    <span className="text-white font-black tracking-wider text-lg shadow-black drop-shadow-md">
                        {getInstruction()}
                    </span>
                </div>
            </div>
            
            <button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-2xl font-bold text-sm backdrop-blur-md">
                 {settings.language === Language.DA ? 'STOP' : 'EXIT'}
            </button>
        </div>

        {/* Timer "Clock" - Positioned to the side (Absolute) */}
        <div className={`
            absolute z-30 transition-all duration-300
            right-4 top-20 md:right-8 md:top-1/2 md:-translate-y-1/2
            w-24 h-24 md:w-40 md:h-40
            bg-white rounded-full border-[6px] md:border-[8px] shadow-[0_10px_20px_rgba(0,0,0,0.2)]
            flex flex-col items-center justify-center
            ${timerColorClass}
        `}>
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60 mb-[-5px]">
                {settings.language === Language.DA ? 'TID' : 'TIME'}
            </div>
            <span className="text-5xl md:text-7xl font-black leading-none">
                {timeLeft}
            </span>
            <Clock size={20} className="mt-1 opacity-40" />
        </div>

        {/* Pause Overlay */}
        {isPaused && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-6 animate-fade-in">
                <h2 className="text-6xl font-black text-white drop-shadow-lg tracking-wider">PAUSE</h2>
                <button 
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black rounded-3xl text-2xl shadow-[0_8px_0_#15803d] active:shadow-none active:translate-y-[8px] transition-all border-4 border-white/20"
                >
                    {settings.language === Language.DA ? 'FORTSÆT' : 'RESUME'}
                </button>
            </div>
        )}

        {/* Main Card Area - Significantly increased width */}
        <div className={`flex-1 flex flex-col items-center justify-center p-4 z-10 w-full max-w-7xl mx-auto md:pr-32 transition-all ${gamePhase !== 'playing' ? 'opacity-0' : 'opacity-100'}`}>
            <GameCard key={currentCard.id} card={currentCard} language={settings.language} />
        </div>

        {/* Big Action Button - Footer (Just Next) */}
        <div className={`p-4 pb-8 flex justify-center z-20 w-full max-w-xl mx-auto md:pr-32 ${gamePhase !== 'playing' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
                onClick={handleNext}
                className="btn-3d w-full max-w-sm bg-[#3b82f6] border-[#1d4ed8] hover:bg-[#2563eb] h-24 rounded-3xl flex flex-row items-center justify-center gap-4 shadow-xl group relative overflow-hidden"
            >
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white font-black text-3xl uppercase tracking-wider drop-shadow-md">
                    {settings.language === Language.DA ? 'VIDERE' : 'NEXT'}
                </span>
                <ArrowRight className="w-10 h-10 text-white drop-shadow-md" strokeWidth={4} />
            </button>
        </div>
    </div>
  );
};