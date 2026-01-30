
export type TileType = {
  id: string;
  emoji: string;
  name: string;
};

export type GameTile = {
  instanceId: string;
  typeId: string;
  x: number;
  y: number;
  layer: number;
  isRemoved: boolean;
  isInTray: boolean;
};

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export type LevelConfig = {
  id: number;
  difficulty: number;
  totalTriplets: number;
  layers: number;
};
