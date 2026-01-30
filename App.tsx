
import React, { useState, useEffect } from 'react';
import { GameState, LevelConfig } from './types';
import { LEVELS } from './constants';
import GameEngine from './components/GameEngine';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('tile-explorer-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const handleWin = () => {
    setGameState(GameState.WON);
    const nextLvl = currentLevel + 1;
    if (nextLvl > highScore) {
      setHighScore(nextLvl);
      localStorage.setItem('tile-explorer-highscore', nextLvl.toString());
    }
  };

  const handleLose = () => {
    setGameState(GameState.LOST);
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length) {
      setCurrentLevel(prev => prev + 1);
      setGameState(GameState.PLAYING);
    } else {
        setGameState(GameState.START);
        setCurrentLevel(1);
    }
  };

  const retryLevel = () => {
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#f8fafc]">
      
      {/* Soft Ambient Background instead of images */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-50 rounded-full blur-[100px] opacity-60" />
      </div>

      {gameState === GameState.START && (
        <div className="text-center animate-in fade-in zoom-in duration-500 max-w-md px-6">
          <div className="mb-8 relative inline-block">
             <div className="absolute -inset-4 bg-sky-200/50 blur-2xl rounded-full animate-pulse" />
             <i className="fas fa-th-large text-7xl text-sky-600 mb-4 relative"></i>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight text-slate-800">
            TILE<span className="text-sky-500">ZEN</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            A beautiful, layered matching experience.<br/>Simple to learn, elegant to play.
          </p>
          <button 
            onClick={startGame}
            className="group relative px-10 py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-[2rem] font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-sky-500/30"
          >
            <span className="flex items-center gap-2">
              PLAY NOW <i className="fas fa-play text-sm"></i>
            </span>
          </button>
          
          <div className="mt-12 flex justify-center gap-8 text-slate-400">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest mb-1 font-bold">Progress</div>
              <div className="text-slate-700 font-bold">Level {currentLevel}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest mb-1 font-bold">Best</div>
              <div className="text-slate-700 font-bold">Lvl {highScore || 1}</div>
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <GameEngine 
          levelId={currentLevel} 
          onWin={handleWin} 
          onLose={handleLose} 
        />
      )}

      {gameState === GameState.WON && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl">
             <div className="text-5xl mb-4">✨</div>
             <h2 className="text-3xl font-black text-slate-800 mb-2">Level Clear</h2>
             <p className="text-slate-500 mb-8 font-medium">Your strategy was perfect. Ready for the next layer?</p>
             <button 
               onClick={nextLevel}
               className="w-full py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-sky-500/20"
             >
               CONTINUE
             </button>
          </div>
        </div>
      )}

      {gameState === GameState.LOST && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl">
             <div className="text-5xl mb-4">🧘</div>
             <h2 className="text-3xl font-black text-slate-800 mb-2">Tray Full</h2>
             <p className="text-slate-500 mb-8 font-medium">Breathe. Sometimes we just need a second try.</p>
             <div className="flex flex-col gap-3">
               <button 
                 onClick={retryLevel}
                 className="w-full py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-sky-500/20"
               >
                 TRY AGAIN
               </button>
               <button 
                 onClick={() => setGameState(GameState.START)}
                 className="w-full py-4 bg-slate-50 text-slate-400 rounded-3xl font-bold transition-all"
               >
                 MENU
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
