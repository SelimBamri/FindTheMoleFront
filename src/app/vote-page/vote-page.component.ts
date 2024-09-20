import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-vote-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vote-page.component.html',
  styleUrl: './vote-page.component.scss',
})
export class VotePageComponent implements OnInit {
  voteForm!: FormGroup;
  fb = inject(FormBuilder);
  players!: string[] | null;
  remainingVotes!: Number | null;
  hasVoted!: boolean;
  vf!: string | null;
  gameService = inject(GameService);
  ngOnInit(): void {
    this.voteForm = this.fb.group({
      votedFor: ['', Validators.required],
    });
    this.gameService.players$.subscribe((res) => {
      this.players = res;
    });
    this.gameService.finalRemainingVotes$.subscribe((res) => {
      this.remainingVotes = res;
    });
    this.gameService.hasVoted$.subscribe((res) => {
      this.hasVoted = res;
    });
    this.gameService.votedFor$.subscribe((res) => {
      this.vf = res;
    });
  }
  onVote() {
    const votedFor = this.voteForm.value['votedFor'];
    this.gameService.vote(
      localStorage.getItem('user')!,
      localStorage.getItem('room')!,
      votedFor
    );
  }
}
