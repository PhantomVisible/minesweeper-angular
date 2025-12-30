import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  @Output() difficultyChanged = new EventEmitter<'easy' | 'medium' | 'hard'>();

  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.difficultyChanged.emit(level);
  }
}
