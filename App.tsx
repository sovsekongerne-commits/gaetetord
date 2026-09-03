import React, { useState, useEffect } from 'react';
import { AppState, GameSettings } from './types';
import { Menu } from './components/Menu';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { Maximize, Minimize, Users } from 'lucide-react';
import { GroupManager } from './components/groups/GroupManager';
import { AudioControl } from './components/AudioControl';

export default function App() {
  const [view, setView] = useState<AppState>(AppState.MENU);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [totalCardsPlayed, setTotalCardsPlayed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGroupManagerOpen, setIsGroupManagerOpen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setView(AppState.GAME);
  };

  const handleEndGame = (total: number) => {
    setTotalCardsPlayed(total);
    setView(AppState.RESULT);
  };

  const handleRestart = () => {
    if (gameSettings) {
        setView(AppState.GAME);
    } else {
        setView(AppState.MENU);
    }
  };

  const handleExit = () => {
    setView(AppState.MENU);
    setGameSettings(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative">
      {/* Global Audio Controls & Settings Toggle */}
      <AudioControl isMenu={view === AppState.MENU} />

      {/* Global Fullscreen Toggle */}
      <button 
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-[100] bg-white/20 hover:bg-white/40 text-white p-3 rounded-xl backdrop-blur-sm transition-all shadow-lg border border-white/20 group"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
            <Minimize size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        ) : (
            <Maximize size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {view === AppState.MENU && (
        <Menu 
          onStart={handleStartGame} 
          isGroupManagerOpen={isGroupManagerOpen}
          setIsGroupManagerOpen={setIsGroupManagerOpen}
        />
      )}
      
      {view === AppState.GAME && gameSettings && (
        <GameScreen 
            settings={gameSettings} 
            onEndGame={handleEndGame}
            onExit={handleExit} 
        />
      )}
      
      {view === AppState.RESULT && gameSettings && (
        <ResultScreen 
            totalPlayed={totalCardsPlayed}
            settings={gameSettings}
            onRestart={handleRestart}
            onHome={handleExit}
        />
      )}

      {/* Tiny Group Button visible globally in-game and on results */}
      {view !== AppState.MENU && (
        <button
          onClick={() => setIsGroupManagerOpen(true)}
          className="fixed bottom-6 right-6 z-[90] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white w-12 h-12 rounded-full shadow-[0_4px_0_#6d28d9] active:translate-y-[2px] active:shadow-[0_1px_0_#6d28d9] border-2 border-white/80 flex items-center justify-center group cursor-pointer transition-all hover:scale-105 select-none"
          title="Vis Grupper 👥"
        >
          <Users size={20} fill="currentColor" />
        </button>
      )}

      {/* Global Group Manager Sidebar */}
      <GroupManager 
        isOpen={isGroupManagerOpen} 
        onClose={() => setIsGroupManagerOpen(false)} 
      />
    </div>
  );
}