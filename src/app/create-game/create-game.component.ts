import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.scss',
})
export class CreateGameComponent {
  createGameForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  gameService = inject(GameService);
  ngOnInit() {
    this.createGameForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', Validators.required],
    });
  }

  createRoom() {
    const { name, capacity } = this.createGameForm.value;
    var roomName: string = this.makeCode();
    this.gameService
      .createRoom(name, roomName, Number(capacity))
      .then(() => {
        localStorage.setItem('user', name);
        localStorage.setItem('room', roomName);
        this.router.navigate(['/lobby']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  makeCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
