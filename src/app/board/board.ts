import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {
  rows = 8;
  cols = 8;

  board: Tile[][] = [];

  constructor() {
    this.createBoard();
  }

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
    
    this.placeMines(10);
    this.calculateAdjacentMines();
  }

  placeMines(minesCount: number) {
  let minesLeft = minesCount;

  while (minesLeft > 0) {
    const r = Math.floor(Math.random() * this.rows);
    const c = Math.floor(Math.random() * this.cols);

    // Check that row exists
    if (!this.board[r]) continue;

    const tile = this.board[r][c];

    if (!tile.isMine) {
      tile.isMine = true;
      minesLeft--;
     }
   }
  }

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

  revealTile(tile: Tile) {
    
  if (tile.isRevealed || tile.isFlagged) return;

  tile.isRevealed = true;

  // If clicked on a mine → Game Over
  if (tile.isMine) {
    alert("BOOM! Game Over");
    this.revealAllMines();
    return;
    }

  // If zero adjacent mines → reveal neighbors
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
  if (unrevealedTiles.length === 10) { // 10 mines
    alert("Congratulations! You cleared the board!");
    }
  }

}
