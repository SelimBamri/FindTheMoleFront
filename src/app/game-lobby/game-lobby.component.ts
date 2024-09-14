import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';

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
  ngOnInit(): void {
    this.gameService.waitingFor$.subscribe((res) => {
      this.remainingPlayers = res;
      console.log(this.remainingPlayers);
    });
  }
}
