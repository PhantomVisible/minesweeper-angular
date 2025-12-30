import { Component, Input } from '@angular/core';
import { Tile } from '../models/tile.model';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.html',
  styleUrls: ['./tile.css']
})
export class TileComponent {

  @Input() tile!: Tile;
  @Input() tileSize!: number;

@Output() mineClicked = new EventEmitter<void>();

onLeftClick(): void {
  if (this.tile.isRevealed || this.tile.isFlagged) return;

  this.tile.isRevealed = true;

  if (this.tile.isMine) {
    this.mineClicked.emit();
  }
}

  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    if (!this.tile.isRevealed) {
      this.tile.isFlagged = !this.tile.isFlagged;
    }
  }
}
