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
  gameService = inject(GameService);
  ngOnInit() {
    localStorage.clear();
    this.joinGameForm = this.fb.group({
      name: ['', Validators.required],
      roomName: ['', Validators.required],
    });
  }

  joinRoom() {
    const { name, roomName } = this.joinGameForm.value;
    this.gameService
      .joinRoom(name, roomName)
      .then(() => {
        localStorage.setItem('user', name);
        localStorage.setItem('room', roomName);
        this.router.navigate(['/lobby']);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
