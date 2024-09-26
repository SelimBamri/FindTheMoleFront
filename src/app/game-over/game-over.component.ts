import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [],
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
    localStorage.clear();
  }

  onNewGame() {
    this.router.navigate(['new-game']);
  }

  onJoinNewGame() {
    this.router.navigate(['join-game']);
  }
}
