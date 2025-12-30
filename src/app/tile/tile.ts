import { Component, Input } from '@angular/core';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-tile',
  standalone: true,
  templateUrl: './tile.html',
  styleUrls: ['./tile.css']
})
export class TileComponent {

  @Input() tile!: Tile;

  onLeftClick(): void {
    if (this.tile.isRevealed || this.tile.isFlagged) return;

    this.tile.isRevealed = true;

    if (this.tile.isMine) {
      alert('BOOM! Game Over');
    }
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    if (!this.tile.isRevealed) {
      this.tile.isFlagged = !this.tile.isFlagged;
    }
  }
}
