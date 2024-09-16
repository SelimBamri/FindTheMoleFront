import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.scss',
})
export class GameLobbyComponent implements OnInit {
  remainingPlayers!: Number;
  roomName = localStorage.getItem('room');
  gameService = inject(GameService);
  router = inject(Router);
  ngOnInit(): void {
    this.gameService.waitingFor$.subscribe((res) => {
      this.remainingPlayers = res;
      if (res == 0) {
        this.router.navigate(['/game']);
      }
    });
  }
}
