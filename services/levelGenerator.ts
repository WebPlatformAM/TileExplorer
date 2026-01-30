
import { GameTile, LevelConfig } from '../types';
import { AVAILABLE_TILES } from '../constants';

export const generateLevel = (config: LevelConfig): GameTile[] => {
  const tiles: GameTile[] = [];
  const selectedTileTypes = AVAILABLE_TILES.slice(0, Math.min(AVAILABLE_TILES.length, config.id + 7));
  
  const tripletsCount = config.totalTriplets;
  const pool: string[] = [];
  for (let i = 0; i < tripletsCount; i++) {
    const type = selectedTileTypes[i % selectedTileTypes.length].id;
    pool.push(type, type, type);
  }

  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let poolIdx = 0;
  const gridWidth = 7;
  const gridHeight = 8;
  
  // Structured patterns: Layers of frames and pillars
  for (let layer = 0; layer < config.layers; layer++) {
    // Each layer gets a slightly different structured layout
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (poolIdx >= pool.length) break;

        let shouldPlace = false;
        
        // Pattern 1: Hollow frame (Outer edges)
        const isEdge = x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1;
        // Pattern 2: Pillars
        const isPillar = x === 1 || x === gridWidth - 2;
        // Pattern 3: Central stack
        const isCenter = x >= 2 && x <= 4 && y >= 3 && y <= 5;

        if (layer === 0) {
            // Base layer is usually a solid frame
            shouldPlace = isEdge || isPillar;
        } else if (layer === 1) {
            // Second layer adds depth to the central pillars
            shouldPlace = isPillar || isCenter;
        } else if (layer % 2 === 0) {
            // Alternating patterns for variety
            shouldPlace = (x + y + layer) % 3 === 0;
        } else {
            shouldPlace = Math.random() > 0.6;
        }

        if (shouldPlace && poolIdx < pool.length) {
          tiles.push({
            instanceId: `tile-${layer}-${x}-${y}-${Math.random()}`,
            typeId: pool[poolIdx++],
            x: x,
            y: y,
            layer: layer,
            isRemoved: false,
            isInTray: false,
          });
        }
      }
    }
  }

  // Ensure all tiles from pool are placed
  while (poolIdx < pool.length) {
    tiles.push({
      instanceId: `tile-extra-${poolIdx}-${Math.random()}`,
      typeId: pool[poolIdx++],
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
      layer: config.layers + 1,
      isRemoved: false,
      isInTray: false,
    });
  }

  return tiles;
};
