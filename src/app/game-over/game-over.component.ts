import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [NgIf],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  gameService = inject(GameService);
  router = inject(Router);
  result!: Number;
  mole!: string | null;
  location!: string | null;
  guessedLocation!: string | null;
  loading = true;
  voteResult!: any[];
  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
    this.gameService.result$.subscribe((res) => (this.result = res));
    this.gameService.mole$.subscribe((res) => (this.mole = res));
    this.gameService.location$.subscribe((res) => (this.location = res));
    this.gameService.guessedLocation$.subscribe(
      (res) => (this.guessedLocation = res)
    );
    this.gameService.voteResult$.subscribe((res) => (this.voteResult = res));
    this.loading = false;
    localStorage.clear();
    this.gameService.waitingFor$.next(10);
    this.gameService.remainingVotes$.next(10);
    this.gameService.finalRemainingVotes$.next(10);
    this.gameService.messages$.next([]);
    this.gameService.isMole$.next(false);
    this.gameService.hasVoted$.next(false);
    this.gameService.location$.next(null);
    this.gameService.guessedLocation$.next(null);
    this.gameService.votedFor$.next(null);
    this.gameService.voteResult$.next([]);
    this.gameService.mole$.next(null);
    this.gameService.message$.next(null);
    this.gameService.result$.next(-1);
  }

  onNewGame() {
    this.router.navigate(['new-game']);
  }

  onJoinNewGame() {
    this.router.navigate(['join-game']);
  }
}
