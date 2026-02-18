import React from 'react';
import { WordCard, Language } from '../types';

interface GameCardProps {
  card: WordCard;
  language: Language;
}

export const GameCard: React.FC<GameCardProps> = ({ card, language }) => {
  // Use local images located in /sprites/cards/ matching the Danish word
  // Remove hyphens to handle "Post-it" -> "Postit.png"
  const filename = card.da.replace(/-/g, '');
  const imageUrl = `/sprites/cards/${filename}.png`;

  return (
    <div className="w-full max-w-3xl mx-auto h-[60vh] md:h-[65vh] bg-[#FAF9F6] text-slate-900 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex flex-col border-[8px] border-white relative animate-pop overflow-hidden transform rotate-1">
      
      {/* Playful background blobs on the text side - made lighter to match theme */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-yellow-100 rounded-full opacity-50 blur-2xl pointer-events-none z-0"></div>
      
      {/* Top Section: Text - Reduced height to 18% (mobile) / 22% (desktop) to give more room for image */}
      <div className="w-full h-[18%] md:h-[22%] flex flex-col items-center justify-center p-1 relative z-10 bg-[#FAF9F6] border-b-4 border-[#EBE9E4]">
        <div className="flex flex-col items-center justify-center w-full">
            {/* Reduced text size slightly to fit the smaller header */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-center break-words leading-tight text-slate-800 drop-shadow-sm uppercase px-4 z-10">
                {language === Language.DA ? card.da : card.en}
            </h2>
            
            {/* Card Counter Badge */}
            <div className="absolute top-2 right-4 bg-black/5 px-2 py-1 rounded-full">
                <span className="text-slate-500 font-bold text-[10px] md:text-xs tracking-widest uppercase">
                    #{card.id + 1}
                </span>
            </div>
        </div>
      </div>

      {/* Bottom Section: Image - Increased height and removed padding */}
      <div className="w-full h-[82%] md:h-[78%] relative overflow-hidden bg-[#FAF9F6] group p-0 flex items-center justify-center">
        <img 
            src={imageUrl} 
            alt="Word hint" 
            // Added scale-[1.2] to increase size by 20% default
            // Adjusted hover scale to 1.3
            className="w-full h-full object-contain transition-transform duration-500 scale-[1.2] group-hover:scale-[1.3] mix-blend-multiply brightness-105 contrast-105"
            loading="eager"
        />
      </div>
    </div>
  );
};