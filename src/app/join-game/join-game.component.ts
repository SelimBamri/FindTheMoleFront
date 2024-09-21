import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-join-game',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-game.component.html',
  styleUrl: './join-game.component.scss',
})
export class JoinGameComponent implements OnInit {
  joinGameForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  message!: string | null;
  gameService = inject(GameService);
  ngOnInit() {
    localStorage.clear();
    this.gameService.message$.subscribe((res) => (this.message = res));
    this.joinGameForm = this.fb.group({
      name: ['', Validators.required],
      roomName: ['', Validators.required],
    });
  }

  joinRoom() {
    const { name, roomName } = this.joinGameForm.value;
    this.gameService.joinRoom(name, roomName);
  }
}
