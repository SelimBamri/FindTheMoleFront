import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  isMole!: boolean;
  currentPlayer!: string;
  location!: string | null;
  locations!: string[] | null;
  players!: string[] | null;
  remainingVotes!: Number | null;
  gameService = inject(GameService);
  ngOnInit(): void {
    this.currentPlayer = localStorage.getItem('user')!;
    this.gameService.isMole$.subscribe((res) => {
      this.isMole = res;
    });
    this.gameService.location$.subscribe((res) => {
      this.location = res;
    });
    this.gameService.players$.subscribe((res) => (this.players = res));
    this.gameService.remainingVotes$.subscribe(
      (res) => (this.remainingVotes = res)
    );
    this.locations = this.gameService.locations;
  }

  onVote() {
    this.gameService.requestVote(
      localStorage.getItem('user')!,
      localStorage.getItem('room')!
    );
  }
}
