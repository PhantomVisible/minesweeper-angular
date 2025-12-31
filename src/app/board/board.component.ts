import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from '../tile/tile.component';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TileComponent],
  template: `
    <div class="board">
      <app-tile 
        *ngFor="let tile of tiles.flat()" 
        [tile]="tile" 
        (tileClicked)="revealTile($event)" 
        (tileFlagged)="toggleFlag($event)">
      </app-tile>
    </div>
  `,
  styles: [`
    .board {
      display: grid;
      grid-template-columns: repeat(8, 40px);
      gap: 4px;
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
    this.placeMines();
    this.calculateAdjacentMines();
  }

  placeMines() {
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
