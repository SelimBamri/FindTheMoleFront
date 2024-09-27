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
  }

  onNewGame() {
    this.router.navigate(['new-game']).then(() => {
      window.location.reload();
    });
  }

  onJoinNewGame() {
    this.router.navigate(['join-game']).then(() => {
      window.location.reload();
    });
  }
}
