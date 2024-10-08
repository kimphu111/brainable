import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../../../../../ngrx/game/game.state';
import { QuizState } from '../../../../../ngrx/quiz/quiz.state';
import { Router } from '@angular/router';
import { GameService } from '../../../../../services/game/game.service';
import * as GameActions from '../../../../../ngrx/game/game.actions';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  pin!: string;
  playerAnswer!: number;
  correctAnswer!: number;
  isCorrect!: boolean;
  playerName!: string;

  score = 0;
  time = 0;

  constructor(
    private store: Store<{ game: GameState; quiz: QuizState }>,
    private gameService: GameService,
  ) {
    this.subscription.push(
      this.store
        .select('game', 'pin')
        .subscribe((pin) => (this.pin = pin as string)),
    );
  }

  ngOnInit(): void {
    this.gameService.listenForNavigateToNextQuestion(this.pin);
    this.gameService.receiveCorrectAnswer().subscribe((correctAnswer) => {
      this.correctAnswer = correctAnswer.correctAnswer;
      this.isCorrect = this.playerAnswer === this.correctAnswer;
      if (this.isCorrect) {
        this.store.dispatch(GameActions.incrementScore());
      }
    });
    this.subscription.push(
      this.store
        .select('game', 'playerAnswer')
        .subscribe(
          (playerAnswer) => (this.playerAnswer = playerAnswer as number),
        ),
      this.store
        .select('game', 'playerName')
        .subscribe((playerName) => (this.playerName = playerName as string)),
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s) => s.unsubscribe());
  }
}
