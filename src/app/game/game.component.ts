import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  faPaperPlane = faPaperPlane;
  inputMessage!: string;
  isMole!: boolean;
  currentPlayer!: string;
  location!: string | null;
  locations!: string[] | null;
  players!: string[] | null;
  remainingVotes!: Number | null;
  gameService = inject(GameService);
  messages!: any[] | null;

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
    this.gameService.messages$.subscribe((res) => (this.messages = res));
    this.locations = this.gameService.locations;
  }

  onVote() {
    this.gameService.requestVote(
      localStorage.getItem('user')!,
      localStorage.getItem('room')!
    );
  }

  onSendMessage() {
    if (this.inputMessage && this.inputMessage.trim()) {
      this.gameService.sendMessage(
        localStorage.getItem('user')!,
        localStorage.getItem('room')!,
        this.inputMessage
      );
      this.inputMessage = '';
    }
  }
}
