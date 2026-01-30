
import { TileType } from './types';

export const TILE_SIZE = 58; 
export const TRAY_CAPACITY = 7;

export const AVAILABLE_TILES: TileType[] = [
  { id: '1', emoji: '🥕', name: 'Carrot' },
  { id: '2', emoji: '🫐', name: 'Blueberry' },
  { id: '3', emoji: '🍉', name: 'Watermelon' },
  { id: '4', emoji: '🍇', name: 'Grapes' },
  { id: '5', emoji: '🍌', name: 'Banana' },
  { id: '6', emoji: '🍒', name: 'Cherry' },
  { id: '7', emoji: '🍄', name: 'Mushroom' },
  { id: '8', emoji: '💎', name: 'Gem' },
  { id: '9', emoji: '🌻', name: 'Flower' },
  { id: '10', emoji: '🌰', name: 'Acorn' },
  { id: '11', emoji: '⚡', name: 'Bolt' },
  { id: '12', emoji: '🔥', name: 'Fire' },
  { id: '13', emoji: '🌽', name: 'Corn' },
  { id: '14', emoji: '🍓', name: 'Strawberry' },
  { id: '15', emoji: '🥑', name: 'Avocado' },
];

export const LEVELS = [
  { id: 1, difficulty: 1, totalTriplets: 8, layers: 2 },
  { id: 2, difficulty: 2, totalTriplets: 12, layers: 3 },
  { id: 3, difficulty: 3, totalTriplets: 18, layers: 4 },
  { id: 4, difficulty: 4, totalTriplets: 24, layers: 5 },
  { id: 5, difficulty: 5, totalTriplets: 30, layers: 6 },
];
