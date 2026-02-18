import React, { useState } from 'react';
import { AppState, GameSettings } from './types';
import { Menu } from './components/Menu';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [view, setView] = useState<AppState>(AppState.MENU);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [totalCardsPlayed, setTotalCardsPlayed] = useState(0);

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
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {view === AppState.MENU && <Menu onStart={handleStartGame} />}
      
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
    </div>
  );
}