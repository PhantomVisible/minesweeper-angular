import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from '../tile/tile.component';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TileComponent],
  template: `
    <div class="difficulty-buttons">
      <button (click)="setDifficulty('easy')">Easy</button>
      <button (click)="setDifficulty('medium')">Medium</button>
      <button (click)="setDifficulty('hard')">Hard</button>
    </div>

    <div class="board">
      <div *ngFor="let row of tiles" class="row">
        <app-tile *ngFor="let tile of row" [tile]="tile"></app-tile>
      </div>
    </div>
  `,
  styles: [`
    .board {
      display: grid;
      grid-template-columns: repeat(8, 40px);
      gap: 4px;
    }
    .difficulty-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    .difficulty-buttons button {
      padding: 6px 12px;
      cursor: pointer;
    }
  `]
})
export class BoardComponent {
  rows = 8;
  cols = 8;
  tiles: Tile[][] = [];
  mineCount = 10;

  constructor() {
    this.createBoard();
  }

  createBoard() {
    this.tiles = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          revealed: false,
          flagged: false,
          isMine: false,
          adjacentMines: 0,
          row: r,
          col: c
        } as Tile);
      }
      this.tiles.push(row);
    }
    this.placeMines(this.mineCount);
    this.calculateAdjacentMines();
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard') {
  switch (level) {
    case 'easy':
      this.rows = 6; this.cols = 6; this.mineCount = 4; break;
    case 'medium':
      this.rows = 8; this.cols = 8; this.mineCount = 10; break;
    case 'hard':
      this.rows = 12; this.cols = 12; this.mineCount = 25; break;
  }
  this.createBoard();
  }

  placeMines(mineCount: number) {
    let minesLeft = this.mineCount;
    while (minesLeft > 0) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      const tile = this.tiles[r][c];
      if (!tile.isMine) {
        tile.isMine = true;
        minesLeft--;
      }
    }
  }

  calculateAdjacentMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.tiles[r][c];
        if (tile.isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 && nr < this.rows &&
              nc >= 0 && nc < this.cols &&
              this.tiles[nr][nc].isMine
            ) count++;
          }
        }
        tile.adjacentMines = count;
      }
    }
  }

  revealTile(tile: Tile) {
    if (tile.revealed || tile.flagged) return;
    tile.revealed = true;

    if (tile.isMine) {
      alert('BOOM! Game Over');
      this.revealAllMines();
      return;
    }

    if (tile.adjacentMines === 0) {
      this.revealNeighbors(tile);
    }

    this.checkWin();
  }

  revealNeighbors(tile: Tile) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = tile.row + dr;
        const nc = tile.col + dc;
        if (
          nr >= 0 && nr < this.rows &&
          nc >= 0 && nc < this.cols
        ) {
          const neighbor = this.tiles[nr][nc];
          if (!neighbor.revealed && !neighbor.isMine) {
            neighbor.revealed = true;
            if (neighbor.adjacentMines === 0) {
              this.revealNeighbors(neighbor);
            }
          }
        }
      }
    }
  }

  toggleFlag(tile: Tile) {
    tile.flagged = !tile.flagged;
  }

  revealAllMines() {
    this.tiles.flat().forEach(t => {
      if (t.isMine) t.revealed = true;
    });
  }

  checkWin() {
    const unrevealed = this.tiles.flat().filter(t => !t.revealed);
    if (unrevealed.length === this.mineCount) {
      alert('Congratulations! You cleared the board!');
    }
  }
}
