import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../../../../../ngrx/game/game.state';
import { GameService } from '../../../../../services/game/game.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import * as GameActions from '../../../../../ngrx/game/game.actions';

@Component({
  selector: 'app-waiting',
  standalone: true,
  imports: [FormsModule, MatButton],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.scss',
})
export class WaitingComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  nickname: string = '';
  pin!: string;
  isJoining: boolean = false;

  constructor(
    private store: Store<{ game: GameState }>,
    private gameService: GameService,
  ) {}

  ngOnInit(): void {
    this.gameService.listenForNavigationCountDown(this.pin);
    this.subscriptions.push(
      this.store.select('game', 'pin').subscribe((pin) => {
        if (pin) {
          if (pin) {
            this.pin = pin as string;
          } else {
            this.store.dispatch(GameActions.storePin({ pin: this.pin }));
          }
        }
      }),
    );
  }

  joinGame(): void {
    this.gameService.joinRoom(this.pin, this.nickname);
    this.isJoining = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
