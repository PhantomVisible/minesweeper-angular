export interface Tile {
  col: number;
  row: number;
  flagged: boolean;
  revealed: boolean;
  isMine?: boolean;
  adjacentMines?: number;
}
