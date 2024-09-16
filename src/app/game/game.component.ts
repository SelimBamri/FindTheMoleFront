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
  location!: string | null;
  gameService = inject(GameService);
  ngOnInit(): void {
    this.gameService.isMole$.subscribe((res) => {
      this.isMole = res;
    });
    this.gameService.location$.subscribe((res) => {
      this.location = res;
    });
  }
}
