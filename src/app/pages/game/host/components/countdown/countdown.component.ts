import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { GameState } from '../../../../../ngrx/game/game.state';
import { Store } from '@ngrx/store';
import * as GameActions from '../../../../../ngrx/game/game.actions';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [SharedModule, NgIf, NgForOf],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
})
export class CountdownComponent implements OnInit {
  countdownNumbers = [3, 2, 1];
  activeNumber = 3;
  showFinalText = false;
  hideSquares = false;
  hiddenNumbers: Set<number> = new Set(); // Track hidden numbers
  pin!: string;

  constructor(
    private router: Router,
    private store: Store<{ game: GameState }>,
  ) {}

  ngOnInit() {
    this.startCountdown();
    this.store.select('game', 'pin').subscribe((pin) => {
      console.log('pin', pin);
      if (pin) {
        this.pin = pin as string;
      } else {
        this.store.dispatch(GameActions.storePin({ pin: this.pin }));
      }
    });
  }

  startCountdown() {
    let index = 0;
    const countdownInterval = setInterval(() => {
      if (index > 0) {
        this.hiddenNumbers.add(this.countdownNumbers[index - 1]); // Hide the previous number
      }
      this.activeNumber = this.countdownNumbers[index];
      index++;

      if (index === this.countdownNumbers.length) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          this.showFinalText = true;
          this.hideSquares = true; // Hide squares after countdown
          this.router.navigate([`/host/${this.pin}/question`]);
        }, 1000);
      }
    }, 1000);
  }

  getClass(number: number): { [key: string]: boolean } {
    return {
      [`active-${number}`]: this.activeNumber === number,
      hidden: this.hideSquares || this.hiddenNumbers.has(number),
      active: this.activeNumber === number && !this.hiddenNumbers.has(number), // Add active class
    };
  }
}
