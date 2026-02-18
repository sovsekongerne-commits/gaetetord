import React from 'react';
import { GameSettings, Language } from '../types';
import { RefreshCw, Home, Trophy, Star, ThumbsUp } from 'lucide-react';

interface ResultScreenProps {
  totalPlayed: number;
  settings: GameSettings;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ totalPlayed, settings, onRestart, onHome }) => {
  const isDa = settings.language === Language.DA;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#8b5cf6] text-white p-6 relative overflow-hidden">
        {/* Confetti-like background decorations */}
        <div className="absolute top-20 left-10 text-yellow-300 animate-bounce"><Star size={40} fill="currentColor" /></div>
        <div className="absolute bottom-40 right-10 text-pink-300 animate-pulse"><Star size={50} fill="currentColor" /></div>
        <div className="absolute top-40 right-20 text-blue-300 animate-spin-slow"><Star size={30} fill="currentColor" /></div>

        <h1 className="text-5xl font-black mb-8 text-white drop-shadow-lg text-center animate-pop rotate-[-2deg]">
            {isDa ? 'Færdig!' : 'Finished!'}
        </h1>
        
        <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] shadow-[0_10px_0_rgba(0,0,0,0.2)] text-center w-full max-w-sm mb-10 border-8 border-white/20 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#fbbf24] p-4 rounded-full border-4 border-white shadow-lg">
                <ThumbsUp size={48} className="text-white" fill="currentColor" />
            </div>
            
            <div className="mt-8 mb-4 text-slate-400 font-bold uppercase tracking-wider">
                {isDa ? 'I klarede det!' : 'You did it!'}
            </div>
            <div className="text-7xl font-black mb-4 text-[#8b5cf6] drop-shadow-sm animate-wiggle">
                {totalPlayed}
            </div>
            <div className="bg-slate-100 rounded-xl py-2 px-4 inline-block">
                <span className="text-slate-500 font-bold uppercase">
                    {isDa ? `Kort i alt` : `Cards total`}
                </span>
            </div>
            <p className="mt-6 text-slate-600 font-bold text-lg">
                {isDa ? 'Godt arbejdet alle sammen!' : 'Great job everyone!'}
            </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
            <button 
                onClick={onRestart}
                className="animate-dance w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-[0_6px_0_#0369a1] active:shadow-none active:translate-y-[6px] border-b-4 border-[#0369a1]"
            >
                <RefreshCw size={28} strokeWidth={3} />
                {isDa ? 'SPIL IGEN' : 'PLAY AGAIN'}
            </button>
            
            <button 
                onClick={onHome}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
                <Home size={24} />
                {isDa ? 'HOVEDMENU' : 'MAIN MENU'}
            </button>
        </div>
    </div>
  );
};