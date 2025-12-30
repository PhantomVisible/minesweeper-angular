import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from '../models/tile.model';
import { TileComponent } from '../tile/tile';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TileComponent],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit {

  ngOnInit() {
  this.updateTileSize();
  }
  // --- Board size and difficulty ---
  rows = 8;
  cols = 8;

    // --- Tile size property ---
  tileSize = 40;

  // --- Board array ---
  board: Tile[][] = [];
  
  private _difficulty: 'easy' | 'medium' | 'hard' = 'medium';

  @Input() set difficulty(level: 'easy' | 'medium' | 'hard') {
  this._difficulty = level;
  this.updateTileSize();
  }

  get difficulty() {
  return this._difficulty;
  }

  updateTileSize() {
  switch (this._difficulty) {
    case 'easy': this.tileSize = 50; this.rows = 6; this.cols = 6; break;
    case 'medium': this.tileSize = 40; this.rows = 8; this.cols = 8; break;
    case 'hard': this.tileSize = 30; this.rows = 12; this.cols = 12; break;
   }
  this.createBoard();
  }

  // --- For CSS grid in template ---
  get gridTemplateColumns() {
  return `repeat(${this.cols}, ${this.tileSize}px)`;
  }
  get gridTemplateRows() {
  return `repeat(${this.rows}, ${this.tileSize}px)`;
  }

  // --- Create board and initialize tiles ---
  createBoard() {
    this.board = [];

    for (let r = 0; r < this.rows; r++) {
      const row: Tile[] = [];

      for (let c = 0; c < this.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0
        });
      }

      this.board.push(row);
    }

    // --- FIX: use this. to call methods inside class ---
    this.placeMines(this.getMinesCount());
    this.calculateAdjacentMines();
  }

  // --- Get mines count depending on difficulty ---
  getMinesCount(): number {
  switch(this._difficulty) {
    case 'easy': return 4;
    case 'medium': return 10;
    case 'hard': return 25;
    default: return 10;
    }
  }


  // --- Place mines randomly ---
  placeMines(minesCount: number) {
    let minesLeft = minesCount;

    while (minesLeft > 0) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      // --- CHECK: row exists ---
      if (!this.board[r]) continue;

      const tile = this.board[r][c];

      if (!tile.isMine) {
        tile.isMine = true;
        minesLeft--;
      }
    }
  }

  // --- Calculate adjacent mines for each tile ---
  calculateAdjacentMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.board[r][c];
        if (tile.isMine) continue;

        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;

            if (
              nr >= 0 && nr < this.rows &&
              nc >= 0 && nc < this.cols &&
              this.board[nr][nc].isMine
            ) {
              count++;
            }
          }
        }
        tile.adjacentMines = count;
      }
    }
  }

  // --- Reveal tile on click ---
  revealTile(tile: Tile) {
    if (tile.isRevealed || tile.isFlagged) return;

    tile.isRevealed = true;

    if (tile.isMine) {
      alert("BOOM! Game Over");
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

        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          const neighbor = this.board[nr][nc];
          if (!neighbor.isRevealed && !neighbor.isMine) {
            neighbor.isRevealed = true;
            if (neighbor.adjacentMines === 0) {
              this.revealNeighbors(neighbor);
            }
          }
        }
      }
    }
  }

  toggleFlag(event: MouseEvent, tile: Tile) {
    event.preventDefault();
    if (tile.isRevealed) return;
    tile.isFlagged = !tile.isFlagged;
  }

  revealAllMines() {
    for (let row of this.board) {
      for (let tile of row) {
        if (tile.isMine) tile.isRevealed = true;
      }
    }
  }

  checkWin() {
    const unrevealedTiles = this.board.flat().filter(t => !t.isRevealed);
    if (unrevealedTiles.length === this.getMinesCount()) {
      alert("Congratulations! You cleared the board!");
    }
  }
}
