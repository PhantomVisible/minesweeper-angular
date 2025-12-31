import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="tile"
      [class.revealed]="tile.revealed"
      (click)="onLeftClick()"
      (contextmenu)="onRightClick($event)">
      
      <span *ngIf="tile.flagged">🚩</span>
      <span *ngIf="tile.revealed && tile.isMine">💣</span>
      <span *ngIf="tile.revealed && !tile.isMine">{{ tile.adjacentMines || '' }}</span>
    </div>
  `,
  styles: [`
    .tile {
      width: 40px;
      height: 40px;
      background: #bdbdbd;
      border: 1px solid #7b7b7b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }
    .tile.revealed {
      background: #e0e0e0;
    }
  `]
})
export class TileComponent {
  @Input() tile!: Tile;
  @Output() tileClicked = new EventEmitter<Tile>();
  @Output() tileFlagged = new EventEmitter<Tile>();

  onLeftClick() {
    if (this.tile.revealed || this.tile.flagged) return;
    this.tileClicked.emit(this.tile);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    if (this.tile.revealed) return;
    this.tileFlagged.emit(this.tile);
  }
}
