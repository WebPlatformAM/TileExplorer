
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameTile, GameState } from '../types';
import { LEVELS, TRAY_CAPACITY, TILE_SIZE } from '../constants';
import { generateLevel } from '../services/levelGenerator';
import Tile from './Tile';

interface GameEngineProps {
  levelId: number;
  onWin: () => void;
  onLose: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ levelId, onWin, onLose }) => {
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [tray, setTray] = useState<GameTile[]>([]);
  const [history, setHistory] = useState<GameTile[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = window.innerWidth * 0.95;
        const availableHeight = window.innerHeight * 0.55;
        const baseWidth = 420;
        const baseHeight = 500;
        
        const scaleX = availableWidth / baseWidth;
        const scaleY = availableHeight / baseHeight;
        setScale(Math.min(scaleX, scaleY, 1.1));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const config = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setTiles(generateLevel(config));
    setTray([]);
    setHistory([]);
  }, [levelId]);

  const isTileBlocked = useCallback((tile: GameTile, allTiles: GameTile[]) => {
    return allTiles.some(other => {
      if (other.isRemoved || other.isInTray || other.layer <= tile.layer) return false;
      const xOverlap = Math.abs(tile.x - other.x) < 0.9;
      const yOverlap = Math.abs(tile.y - other.y) < 0.9;
      return xOverlap && yOverlap;
    });
  }, []);

  const handleTileClick = (clickedTile: GameTile) => {
    if (tray.length >= TRAY_CAPACITY) return;

    setHistory(prev => [...prev, tray]);

    const updatedTile = { ...clickedTile, isInTray: true };
    setTiles(prev => prev.map(t => t.instanceId === clickedTile.instanceId ? updatedTile : t));

    setTray(prev => {
      const newTray = [...prev, updatedTile];
      // Сортировка по типу плитки, чтобы одинаковые были рядом
      newTray.sort((a, b) => a.typeId.localeCompare(b.typeId));

      const typeCounts: Record<string, number> = {};
      newTray.forEach(t => typeCounts[t.typeId] = (typeCounts[t.typeId] || 0) + 1);
      const matchedType = Object.keys(typeCounts).find(typeId => typeCounts[typeId] >= 3);

      if (matchedType) {
        setTimeout(() => {
          setTray(currentTray => currentTray.filter(t => t.typeId !== matchedType));
          setTiles(currentTiles => currentTiles.map(t => 
            t.typeId === matchedType && t.isInTray ? { ...t, isRemoved: true, isInTray: false } : t
          ));
        }, 300);
      }
      return newTray;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastTray = history[history.length - 1];
    const currentTrayIds = new Set(tray.map(t => t.instanceId));
    const lastTrayIds = new Set(lastTray.map(t => t.instanceId));
    const addedTileId = [...currentTrayIds].find(id => !lastTrayIds.has(id));

    if (addedTileId) {
      setTiles(prev => prev.map(t => t.instanceId === addedTileId ? { ...t, isInTray: false } : t));
      setTray(lastTray);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleShuffle = () => {
    const onBoard = tiles.filter(t => !t.isRemoved && !t.isInTray);
    const coords = onBoard.map(t => ({ x: t.x, y: t.y, layer: t.layer }));
    for (let i = coords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coords[i], coords[j]] = [coords[j], coords[i]];
    }
    setTiles(prev => {
      let shuffleIdx = 0;
      return prev.map(t => {
        if (!t.isRemoved && !t.isInTray) {
          const newCoord = coords[shuffleIdx++];
          return { ...t, ...newCoord };
        }
        return t;
      });
    });
  };

  const activeTiles = useMemo(() => tiles.filter(t => !t.isRemoved && !t.isInTray), [tiles]);

  useEffect(() => {
    if (tiles.length > 0 && activeTiles.length === 0 && tray.length === 0) {
      onWin();
    } else if (tray.length >= TRAY_CAPACITY) {
      const timer = setTimeout(() => {
          // Проверяем еще раз, не исчезло ли что-то за 300мс (матч)
          if (tray.length >= TRAY_CAPACITY) onLose();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [tiles, tray, onWin, onLose, activeTiles]);

  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto relative overflow-hidden pt-4">
      
      {/* Заголовок уровня */}
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-slate-700">Level {levelId}</h2>
      </div>

      {/* Игровое поле */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-visible">
        <div 
          ref={containerRef}
          className="relative transition-transform duration-300 ease-out" 
          style={{ 
            width: '420px', 
            height: '480px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {activeTiles.map((tile) => (
            <Tile 
              key={tile.instanceId} 
              tile={tile} 
              isBlocked={isTileBlocked(tile, activeTiles)} 
              onClick={handleTileClick} 
            />
          ))}
        </div>
      </div>

      {/* Область лотка (Рамка) */}
      <div className="w-full px-4 pb-8 md:pb-12 flex flex-col items-center">
        <div className="w-full max-w-[440px] tray-frame rounded-[2rem] p-3 flex gap-1.5 shadow-2xl">
          {/* Мы отрисовываем фиксированное количество слотов */}
          {Array.from({ length: TRAY_CAPACITY }).map((_, i) => (
            <div key={i} className="flex-1 aspect-square relative">
              {/* Пустой слот (рамка) */}
              <div className="absolute inset-0 tray-slot-empty" />
              
              {/* Плитка в слоте, если она там есть */}
              {tray[i] && (
                <div className="absolute inset-0 p-0.5 z-10">
                  <Tile 
                    tile={tray[i]} 
                    isBlocked={false} 
                    onClick={() => {}} 
                    isTrayTile={true} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Кнопки управления */}
        <div className="mt-8 flex justify-center gap-6">
          <button onClick={handleUndo} className="action-btn w-14 h-14 rounded-full flex items-center justify-center text-xl" title="Undo">
            <i className="fas fa-undo"></i>
          </button>
          <button className="action-btn w-14 h-14 rounded-full flex items-center justify-center text-xl" title="Hint">
            <i className="fas fa-magic"></i>
          </button>
          <button onClick={handleShuffle} className="action-btn w-14 h-14 rounded-full flex items-center justify-center text-xl" title="Shuffle">
            <i className="fas fa-random"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEngine;
