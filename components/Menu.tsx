import React, { useState } from 'react';
import { GameMode, Language, GameSettings } from '../types';
import { Mic2, HandMetal, VolumeX, Play, ChevronLeft, Star, Smile, Zap, Heart, Layers, Info, Users, ScanFace, RefreshCw, ArrowRight, Check, Clock } from 'lucide-react';

interface MenuProps {
  onStart: (settings: GameSettings) => void;
}

type MenuStep = 'intro' | 'tutorial' | 'language' | 'mode' | 'count' | 'duration';

export const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [step, setStep] = useState<MenuStep>('intro');
  const [lang, setLang] = useState<Language>(Language.DA);
  const [mode, setMode] = useState<GameMode>(GameMode.MIME);
  const [cardCount, setCardCount] = useState<number>(10);
  const [hoveredMode, setHoveredMode] = useState<GameMode | null>(null);
  const [tutorialFlipped, setTutorialFlipped] = useState(false);

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setStep('mode');
  };

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setStep('count');
  };

  const handleCountSelect = (count: number) => {
    setCardCount(count);
    setStep('duration');
  };

  const handleDurationSelect = (duration: number) => {
    onStart({ 
        language: lang, 
        mode: mode, 
        duration: duration, 
        cardLimit: cardCount 
    });
  };

  const getModeDescription = (m: GameMode) => {
      if (lang === Language.DA) {
          switch (m) {
              case GameMode.MIME: return "Du må ikke sige lyde! 🤐 Brug kun din krop, hænder og ansigtsudtryk til at vise ordet.";
              case GameMode.EXPLAIN: return "Du må tale løs! 🗣️ Men du må ikke sige selve ordet eller dele af det.";
              case GameMode.SILENT: return "Sig ordet tydeligt uden lyd! 🐟 De andre skal mundaflæse, hvad du siger.";
              default: return "";
          }
      } else {
           switch (m) {
              case GameMode.MIME: return "No sounds allowed! 🤐 Use only your body, hands, and facial expressions.";
              case GameMode.EXPLAIN: return "Speak freely! 🗣️ But you cannot say the word itself or parts of it.";
              case GameMode.SILENT: return "Mouth the word clearly without sound! 🐟 Others must lip-read.";
              default: return "";
          }
      }
  };

  // Background decoration component to reuse
  const BackgroundDecorations = () => (
    <>
      <div className="absolute top-10 left-10 text-yellow-300 opacity-40 animate-spin-slow pointer-events-none">
          <Star size={60} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-white opacity-20 animate-float pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-white blur-xl"></div>
      </div>
      <div className="absolute top-1/4 right-10 text-pink-400 opacity-30 animate-wiggle pointer-events-none">
          <Heart size={50} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 left-1/4 text-green-300 opacity-30 animate-dance pointer-events-none" style={{animationDuration: '3s'}}>
          <Smile size={70} />
      </div>
       <div className="absolute top-20 left-1/3 text-orange-400 opacity-30 animate-float pointer-events-none" style={{animationDelay: '1s'}}>
          <Zap size={40} fill="currentColor" />
      </div>
      
      {/* Extra Emojis for coziness */}
      <div className="absolute top-[15%] left-[10%] text-4xl opacity-20 animate-float pointer-events-none" style={{animationDelay: '2s'}}>🎈</div>
      <div className="absolute bottom-[30%] left-[5%] text-5xl opacity-20 animate-wiggle pointer-events-none" style={{animationDelay: '0.5s'}}>🍭</div>
      <div className="absolute top-[40%] right-[15%] text-4xl opacity-20 animate-bounce pointer-events-none" style={{animationDuration: '4s'}}>🧩</div>
      <div className="absolute bottom-[15%] right-[30%] text-5xl opacity-20 animate-float pointer-events-none" style={{animationDelay: '1.5s'}}>🪁</div>
    </>
  );

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#38bdf8] to-[#3b82f6] p-6 relative overflow-hidden">
        <BackgroundDecorations />

        <div className="z-10 flex flex-col items-center animate-pop w-full max-w-5xl">
          <div className="relative bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_15px_0_rgba(0,0,0,0.1)] rotate-[-3deg] mb-10 md:mb-16 border-[6px] md:border-[10px] border-white animate-wiggle">
             <div className="absolute -top-6 -left-6 text-6xl animate-bounce" style={{animationDuration: '2s'}}>🎪</div>
             <div className="absolute -bottom-6 -right-6 text-6xl animate-bounce" style={{animationDuration: '2.5s'}}>🎨</div>
             <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0ea5e9] drop-shadow-sm leading-none text-center">
              Gæt et ord
            </h1>
          </div>
          <p className="text-blue-100 text-xl md:text-3xl font-bold mb-12 md:mb-20 animate-pulse drop-shadow-md text-center leading-relaxed">
            Gæt og Grimasser for alle!
            <span className="block text-4xl md:text-6xl mt-4 md:mt-6 flex justify-center gap-4">
                <span>🤪</span>
                <span>🎭</span>
                <span>⏱️</span>
                <span>🦁</span>
            </span>
          </p>
          
          <button
            onClick={() => setStep('tutorial')}
            className="animate-dance group relative bg-[#fbbf24] hover:bg-[#f59e0b] text-white text-2xl sm:text-3xl md:text-5xl font-black py-6 px-10 md:py-10 md:px-20 rounded-[2rem] shadow-[0_8px_0_#d97706] md:shadow-[0_12px_0_#d97706] active:shadow-[0_2px_0_#d97706] active:translate-y-[6px] transition-all flex items-center gap-3 md:gap-6 border-[5px] md:border-[8px] border-[#fffbeb]"
          >
            <Play className="w-8 h-8 md:w-14 md:h-14 group-hover:scale-110 transition-transform" fill="currentColor" />
            <span className="whitespace-nowrap">START SPILLET 🚀</span>
          </button>
        </div>
      </div>
    );
  }

  // Tutorial Flip Card
  if (step === 'tutorial') {
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-[#38bdf8] p-4 relative [perspective:2000px] overflow-y-auto"
        >
            <BackgroundDecorations />
            
            {/* 
                COMPACT SIZE:
                max-w-3xl, h-[600px] 
            */}
            <div className="w-full max-w-3xl h-[600px] relative z-20 my-auto">
                
                {/* The "Flipper" Inner Container */}
                <div className={`relative w-full h-full spring-flip preserve-3d ${tutorialFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* --- FRONT SIDE: SETUP --- */}
                    <div 
                        onClick={() => setTutorialFlipped(true)}
                        className="absolute inset-0 backface-hidden bg-white text-slate-900 w-full h-full p-6 md:p-8 rounded-[2rem] shadow-xl border-[6px] border-yellow-400 flex flex-col items-center text-center overflow-hidden cursor-pointer"
                    >
                        <div className="w-full flex justify-end">
                            <div className="text-slate-300 font-bold text-xl">1 / 2</div>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-[#0ea5e9] mb-4 uppercase tracking-tight relative z-10 mt-1">
                            Sådan spiller I
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative z-10 mb-4">
                            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex flex-col items-center gap-2 shadow-sm">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <Users size={36} className="text-[#0ea5e9]" />
                                </div>
                                <h3 className="font-black text-2xl text-slate-800">Lav makkerpar</h3>
                                <p className="text-slate-600 font-bold text-lg leading-tight">
                                    Stil jer overfor hinanden.
                                </p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-100 flex flex-col items-center gap-2 shadow-sm">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <ScanFace size={36} className="text-pink-500" />
                                </div>
                                <h3 className="font-black text-2xl text-slate-800">Ryg til skærmen</h3>
                                <p className="text-slate-600 font-bold text-lg leading-tight">
                                    Gætteren må <span className="underline decoration-pink-300">ikke</span> se!
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 w-full p-5 rounded-2xl border-2 border-yellow-200 relative z-10 shadow-sm flex-1 flex flex-col justify-center">
                            <h3 className="font-black text-xl mb-1 uppercase text-yellow-600">Opgaven</h3>
                            <p className="text-2xl font-bold text-slate-800 leading-snug">
                                En forklarer/mimer.<br/>
                                Den anden gætter hurtigst muligt!
                            </p>
                        </div>

                        <div className="mt-6 animate-pulse flex items-center justify-center">
                            <span className="text-slate-400 font-black uppercase tracking-widest text-base flex items-center gap-2">
                                Tryk for at komme videre <ArrowRight size={24} />
                            </span>
                        </div>
                    </div>

                    {/* --- BACK SIDE: RULES --- */}
                    <div 
                        onClick={() => setStep('language')}
                        className="absolute inset-0 backface-hidden rotate-y-180 bg-white text-slate-900 w-full h-full p-6 md:p-8 rounded-[2rem] shadow-xl border-[6px] border-green-400 flex flex-col items-center text-center overflow-hidden cursor-pointer"
                    >
                        <div className="w-full flex justify-end">
                            <div className="text-slate-300 font-bold text-xl">2 / 2</div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-green-500 mb-4 uppercase tracking-tight relative z-10 mt-1">
                            Vigtige Regler!
                        </h2>

                        <div className="grid grid-cols-2 gap-3 w-full relative z-10 mb-3">
                            {/* Setup & Points */}
                            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex flex-col items-center gap-2 shadow-sm justify-center">
                                <Users size={32} className="text-[#0ea5e9]" />
                                <h3 className="font-black text-xl text-slate-800 uppercase leading-none">I er et hold</h3>
                            </div>

                            {/* Switching */}
                            <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 flex flex-col items-center gap-2 shadow-sm justify-center">
                                <RefreshCw size={32} className="text-purple-500" />
                                <h3 className="font-black text-xl text-slate-800 uppercase leading-tight">Skift plads efter hvert ord!</h3>
                            </div>
                        </div>

                        {/* The Golden Rule: Silence */}
                        <div className="bg-red-50 w-full p-4 rounded-2xl border-2 border-red-200 relative z-10 shadow-sm flex flex-col justify-center flex-1 mb-3">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-0.5 rounded-full font-black uppercase text-xs tracking-widest shadow-md transform -rotate-1">
                                VIGTIGST!
                            </div>
                            <h3 className="font-black text-2xl mb-2 text-slate-800 mt-2 uppercase flex items-center justify-center gap-2">
                                Når ordet er gættet... 🤫
                            </h3>
                            <div className="text-left bg-white/70 p-4 rounded-xl space-y-2">
                                <div className="flex items-start gap-3">
                                    <span className="bg-red-100 text-red-600 font-black w-7 h-7 flex items-center justify-center rounded-full text-base shrink-0 mt-0.5">1</span>
                                    <p className="text-slate-700 font-bold leading-tight text-lg">Forklareren må kun <span className="underline decoration-4 decoration-yellow-400">nikke</span>.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-red-100 text-red-600 font-black w-7 h-7 flex items-center justify-center rounded-full text-base shrink-0 mt-0.5">2</span>
                                    <p className="text-slate-700 font-bold leading-tight text-lg">Tag <span className="text-blue-600 font-black">armene ned</span> langs siden.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-red-100 text-red-600 font-black w-7 h-7 flex items-center justify-center rounded-full text-base shrink-0 mt-0.5">3</span>
                                    <p className="text-slate-700 font-bold leading-tight text-lg">Vær herefter <span className="text-red-600 font-black">HELT STILLE</span> så de andre ikke hører svaret fra jer.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto animate-pulse flex items-center justify-center pt-4">
                             <span className="text-slate-400 font-black uppercase tracking-widest text-base flex items-center gap-2">
                                Tryk for at spille <Check size={24} />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
  }

  // Language Selection
  if (step === 'language') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#a855f7] p-6 relative overflow-hidden">
        <BackgroundDecorations />
        <h2 className="text-4xl md:text-6xl font-black text-white mb-12 md:mb-20 text-center drop-shadow-md z-10 flex items-center gap-4 flex-col md:flex-row">
            <span>🌍</span>
            <span>{lang === Language.DA ? 'Hvilket sprog?' : 'Which Language?'}</span>
            <span>🗣️</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
          <button
            onClick={() => handleLanguageSelect(Language.DA)}
            className="hover-dance bg-white hover:bg-slate-50 text-slate-800 p-10 md:p-16 rounded-[2.5rem] shadow-[0_10px_0_rgba(0,0,0,0.1)] active:translate-y-[6px] active:shadow-none transition-all border-b-[10px] border-slate-200 flex flex-col items-center gap-6 group"
          >
            <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🇩🇰</span>
            <span className="text-3xl md:text-4xl font-black">DANSK</span>
            <span className="text-2xl">Hej! 👋</span>
          </button>
          
          <button
            onClick={() => handleLanguageSelect(Language.EN)}
            className="hover-dance bg-white hover:bg-slate-50 text-slate-800 p-10 md:p-16 rounded-[2.5rem] shadow-[0_10px_0_rgba(0,0,0,0.1)] active:translate-y-[6px] active:shadow-none transition-all border-b-[10px] border-slate-200 flex flex-col items-center gap-6 group"
          >
            <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🇬🇧</span>
            <span className="text-3xl md:text-4xl font-black">ENGLISH</span>
            <span className="text-2xl">Hello! 🎩</span>
          </button>
        </div>
        
        <button 
            onClick={() => {
                setStep('tutorial');
                setTutorialFlipped(false);
            }}
            className="mt-16 text-white/70 hover:text-white font-bold text-xl flex items-center gap-2 z-10"
        >
            <ChevronLeft size={32} /> Tilbage
        </button>
      </div>
    );
  }

  // Mode Selection
  if (step === 'mode') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#ec4899] p-6 relative overflow-hidden">
        <BackgroundDecorations />
        <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center drop-shadow-md z-10 flex items-center gap-3 justify-center">
            <span>✨</span>
            <span>{lang === Language.DA ? 'Hvordan vil I spille?' : 'How do you want to play?'}</span>
            <span>🎲</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-6 w-full max-w-2xl z-10 relative">
            <button
                onClick={() => handleModeSelect(GameMode.MIME)}
                onMouseEnter={() => setHoveredMode(GameMode.MIME)}
                onMouseLeave={() => setHoveredMode(null)}
                className="hover-dance relative overflow-hidden bg-[#fbbf24] hover:bg-[#f59e0b] text-white p-8 md:p-10 rounded-3xl shadow-[0_8px_0_#d97706] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-white/20 p-4 rounded-full">
                        <HandMetal size={40} className="md:w-12 md:h-12" />
                    </div>
                    <div className="text-left">
                        <span className="block text-3xl md:text-4xl font-black flex items-center gap-2">
                            {lang === Language.DA ? 'MIME' : 'MIME'} 🤸
                        </span>
                        <span className="text-lg md:text-xl font-semibold opacity-90">{lang === Language.DA ? 'Brug din krop!' : 'Use your body!'}</span>
                    </div>
                </div>
                <Star className="text-white/20 absolute -right-4 -bottom-4 w-32 h-32 rotate-12" />
            </button>

            <button
                onClick={() => handleModeSelect(GameMode.EXPLAIN)}
                onMouseEnter={() => setHoveredMode(GameMode.EXPLAIN)}
                onMouseLeave={() => setHoveredMode(null)}
                className="hover-dance relative overflow-hidden bg-[#22c55e] hover:bg-[#16a34a] text-white p-8 md:p-10 rounded-3xl shadow-[0_8px_0_#15803d] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-white/20 p-4 rounded-full">
                        <Mic2 size={40} className="md:w-12 md:h-12" />
                    </div>
                    <div className="text-left">
                        <span className="block text-3xl md:text-4xl font-black flex items-center gap-2">
                            {lang === Language.DA ? 'FORKLAR' : 'EXPLAIN'} 🦜
                        </span>
                        <span className="text-lg md:text-xl font-semibold opacity-90">{lang === Language.DA ? 'Snak løs!' : 'Talk away!'}</span>
                    </div>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-white/10 absolute -right-2 -top-2" />
            </button>

            <button
                onClick={() => handleModeSelect(GameMode.SILENT)}
                onMouseEnter={() => setHoveredMode(GameMode.SILENT)}
                onMouseLeave={() => setHoveredMode(null)}
                className="hover-dance relative overflow-hidden bg-[#6366f1] hover:bg-[#4f46e5] text-white p-8 md:p-10 rounded-3xl shadow-[0_8px_0_#4338ca] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-white/20 p-4 rounded-full">
                        <VolumeX size={40} className="md:w-12 md:h-12" />
                    </div>
                    <div className="text-left">
                        <span className="block text-3xl md:text-4xl font-black flex items-center gap-2">
                            {lang === Language.DA ? 'LYDLØSE ORD' : 'SILENT WORDS'} 🤐
                        </span>
                        <span className="text-lg md:text-xl font-semibold opacity-90">{lang === Language.DA ? 'Mundbevægelser' : 'Lip sync'}</span>
                    </div>
                </div>
            </button>
        </div>

        {/* Info Tooltip on the right side - Desktop Only */}
        <div className={`fixed right-[5%] top-1/2 -translate-y-1/2 w-80 transition-all duration-300 transform ${hoveredMode ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95 pointer-events-none'} hidden lg:block z-50`}>
            {hoveredMode && (
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-[6px] border-white rotate-2 animate-wiggle relative text-slate-800">
                    {/* Triangle pointer */}
                    <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-r-[25px] border-r-white border-b-[20px] border-b-transparent drop-shadow-sm"></div>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <Info className="text-pink-500" size={32} />
                        <h3 className="text-3xl font-black uppercase tracking-wide">
                            {lang === Language.DA ? 'Regler' : 'Rules'}
                        </h3>
                    </div>
                    
                    <p className="text-xl font-bold leading-relaxed text-slate-600">
                       {getModeDescription(hoveredMode)}
                    </p>
                    
                    <div className="mt-6 text-6xl text-right animate-bounce">
                        {hoveredMode === GameMode.MIME ? '🤸' : hoveredMode === GameMode.EXPLAIN ? '🦜' : '🐟'}
                    </div>
                </div>
            )}
        </div>

        <button 
            onClick={() => setStep('language')}
            className="mt-12 text-white/70 hover:text-white font-bold text-xl flex items-center gap-2 z-10"
        >
            <ChevronLeft size={32} /> {lang === Language.DA ? 'Vælg sprog igen' : 'Change language'}
        </button>
        </div>
    );
  }

  // Count Selection
  if (step === 'count') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#14b8a6] p-4 md:p-6 relative overflow-y-auto">
        <BackgroundDecorations />
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 md:mb-12 text-center drop-shadow-md z-10 flex items-center gap-3 justify-center mt-10 md:mt-0">
          <span>🔢</span>
          <span>{lang === Language.DA ? 'Hvor mange kort?' : 'How many cards?'}</span>
          <span>🃏</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl z-10 mb-10">
          {[5, 10, 15, 20].map((count, idx) => (
               <button
                  key={count}
                  onClick={() => handleCountSelect(count)}
                  className="hover-dance relative overflow-hidden bg-white hover:bg-teal-50 text-teal-600 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_6px_0_#0f766e] md:shadow-[0_8px_0_#0f766e] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center group aspect-square md:aspect-auto md:h-64"
              >
                  <Layers size={40} className="mb-2 md:mb-4 opacity-50 md:w-20 md:h-20" />
                  <span className="text-5xl md:text-8xl font-black">{count}</span>
                  <span className="text-sm md:text-xl font-bold uppercase mt-2">{lang === Language.DA ? 'Kort' : 'Cards'}</span>
                  <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 text-2xl md:text-3xl transition-opacity">👍</div>
              </button>
          ))}
        </div>

        <button 
          onClick={() => setStep('mode')}
          className="mb-8 text-white/70 hover:text-white font-bold text-xl flex items-center gap-2 z-10"
        >
          <ChevronLeft size={32} /> {lang === Language.DA ? 'Vælg kategori igen' : 'Change category'}
        </button>
      </div>
    );
  }

  // Duration Selection
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f97316] p-4 md:p-6 relative overflow-y-auto">
      <BackgroundDecorations />
      <h2 className="text-3xl md:text-5xl font-black text-white mb-8 md:mb-12 text-center drop-shadow-md z-10 flex items-center gap-3 justify-center mt-10 md:mt-0">
        <span>⏱️</span>
        <span>{lang === Language.DA ? 'Hvor lang tid skal i bruge pr. ord?' : 'How much time per word?'}</span>
        <span>⏳</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl z-10 mb-10">
        {[30, 45, 60].map((seconds) => (
             <button
                key={seconds}
                onClick={() => handleDurationSelect(seconds)}
                className="hover-dance relative overflow-hidden bg-white hover:bg-orange-50 text-orange-600 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_6px_0_#c2410c] md:shadow-[0_8px_0_#c2410c] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center group h-48 md:h-64"
            >
                <div className="mb-2 md:mb-4 opacity-50">
                    <Clock size={40} className="md:w-16 md:h-16" />
                </div>
                <span className="text-5xl md:text-7xl font-black">{seconds}</span>
                <span className="text-sm md:text-xl font-bold uppercase mt-2">{lang === Language.DA ? 'Sekunder' : 'Seconds'}</span>
            </button>
        ))}
      </div>

      <button 
        onClick={() => setStep('count')}
        className="mb-8 text-white/70 hover:text-white font-bold text-xl flex items-center gap-2 z-10"
      >
        <ChevronLeft size={32} /> {lang === Language.DA ? 'Vælg antal igen' : 'Change count'}
      </button>
    </div>
  );
};