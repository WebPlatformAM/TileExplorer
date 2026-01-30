
import React from 'react';
import { GameTile } from '../types';
import { AVAILABLE_TILES, TILE_SIZE } from '../constants';

interface TileProps {
  tile: GameTile;
  isBlocked: boolean;
  onClick: (tile: GameTile) => void;
  isTrayTile?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, isBlocked, onClick, isTrayTile = false }) => {
  const type = AVAILABLE_TILES.find(t => t.id === tile.typeId);
  
  if (!type) return null;

  const style: React.CSSProperties = isTrayTile ? {
    width: '100%',
    height: '100%',
  } : {
    position: 'absolute',
    left: `${tile.x * (TILE_SIZE + 2)}px`,
    top: `${tile.y * (TILE_SIZE + 2)}px`,
    zIndex: tile.layer * 10,
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
  };

  const handleClick = () => {
    if (!isBlocked && !isTrayTile) {
      onClick(tile);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={style}
      className={`
        rounded-xl flex items-center justify-center select-none transition-all duration-200
        ${isTrayTile ? 'bg-white shadow-sm border border-slate-100 animate-to-tray' : 'bg-white tile-block border border-slate-200'}
        ${!isTrayTile && isBlocked ? 'brightness-75 grayscale-[0.2] cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
      `}
    >
      <span className={`${isTrayTile ? 'text-2xl' : 'text-3xl'} drop-shadow-sm`}>{type.emoji}</span>
      
      {/* Слой глубины */}
      {!isTrayTile && tile.layer > 0 && (
         <div 
          className="absolute -bottom-1 -right-1 w-full h-full bg-slate-100 -z-10 rounded-xl border border-slate-300"
          style={{ transform: `translate(${tile.layer}px, ${tile.layer}px)` }}
         />
      )}
    </div>
  );
};

export default Tile;
