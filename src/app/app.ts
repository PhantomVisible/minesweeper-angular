import { Component, ViewChild } from '@angular/core';
import { Board } from './board/board';
import { Header } from "./header/header";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [Board, Header]
})
export class App {
  @ViewChild('board') board!: Board;

  onDifficultyChanged(level: 'easy' | 'medium' | 'hard') {
    if (this.board) {
      this.board.difficulty = level;
    }
  }
}
