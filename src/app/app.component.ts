import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  template: `
    <h1>Minesweeper</h1>
    <app-board></app-board>
  `
})
export class AppComponent {}
