import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, X, Music } from 'lucide-react';
import { musicManager } from '../utils/musicManager';

interface AudioControlProps {
  isMenu: boolean;
}

export const AudioControl: React.FC<AudioControlProps> = ({ isMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(musicManager.isMuted());
  const [volume, setVolume] = useState(musicManager.getSettings().volume);

  useEffect(() => {
    // Notify music manager about current view state (menu = higher volume, game = lower volume)
    musicManager.setViewState(isMenu);
  }, [isMenu]);

  useEffect(() => {
    // Initialize audio on first click anywhere on page to comply with browser autoplay policies
    const handleFirstInteraction = () => {
      musicManager.start();
      document.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('pointerdown', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggleMute = () => {
    const muted = musicManager.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    musicManager.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <>
      {/* Sound Settings Toggle Button in Header */}
      <button
        onClick={() => {
          musicManager.start();
          setIsOpen(!isOpen);
        }}
        className="fixed top-4 right-20 z-[100] bg-white/20 hover:bg-white/40 text-white p-3 rounded-xl backdrop-blur-sm transition-all shadow-lg border border-white/20 group flex items-center justify-center cursor-pointer select-none"
        title="Lydindstillinger 🎵"
      >
        {isMuted ? (
          <VolumeX size={24} strokeWidth={2.5} className="text-red-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Volume2 size={24} strokeWidth={2.5} className="text-emerald-400 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Audio Settings Modal / Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-600/30 rounded-2xl border border-purple-400/30 text-purple-300">
                <Music size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Lyd & Musik</h3>
                <p className="text-xs text-slate-400">Juster hyggemusik og lydstyrke</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Mute Toggle Card */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMuted ? (
                    <VolumeX className="text-red-400" size={24} />
                  ) : (
                    <Volume2 className="text-emerald-400" size={24} />
                  )}
                  <div>
                    <span className="font-bold block text-sm">Baggrundsmusik</span>
                    <span className="text-xs text-slate-400">
                      {isMuted ? 'Slået fra (Muted)' : 'Spiller hyggelig melodi'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleToggleMute}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                    isMuted
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isMuted ? 'Tænd Musik' : 'Mute Musik'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Musik Lydstyrke</span>
                  <span className="text-purple-300 font-mono">{Math.round(volume * 100)}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Dynamic Mode Helper Info */}
              <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-3 text-xs text-purple-200/80 flex items-start gap-2">
                <span className="text-base">💡</span>
                <p>
                  Musikken dæmpes automatisk under selve spillet, så I uforstyrret kan snakke og gætte ord sammen.
                </p>
              </div>

              {/* Close Action */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg transition-all text-center cursor-pointer"
              >
                Færdig
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
