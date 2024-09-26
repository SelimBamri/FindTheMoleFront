import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  API_URL: string =
    'https://findthemole-eqgzggefbnhjhthc.francecentral-01.azurewebsites.net/';
  public waitingFor$ = new BehaviorSubject<Number>(10);
  public remainingVotes$ = new BehaviorSubject<Number>(10);
  public finalRemainingVotes$ = new BehaviorSubject<Number>(10);
  public messages$ = new BehaviorSubject<any[]>([]);
  public isMole$ = new BehaviorSubject<boolean>(false);
  public hasVoted$ = new BehaviorSubject<boolean>(false);
  public location$ = new BehaviorSubject<string | null>(null);
  public guessedLocation$ = new BehaviorSubject<string | null>(null);
  public votedFor$ = new BehaviorSubject<string | null>(null);
  public voteResult$ = new BehaviorSubject<any[]>([]);
  public mole$ = new BehaviorSubject<string | null>(null);
  public message$ = new BehaviorSubject<string | null>(null);
  public result$ = new BehaviorSubject<Number>(-1);
  public locations = [
    'Airplane',
    'Bank',
    'Beach',
    'Hospital',
    'School',
    'Restaurant',
    'Train',
    'Supermarket',
    'Football Stadium',
    'Park',
    'Cinema',
    'Hotel',
    'Outer Space',
    'Museum',
    'Boat',
  ];
  public players$ = new BehaviorSubject<string[] | null>(null);
  router = inject(Router);

  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.API_URL}/game`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

  public async start() {
    try {
      await this.connection.start();
      console.log('Connection started successfully');
      if (localStorage.getItem('user')) {
        this.reconnect(
          localStorage.getItem('user')!,
          localStorage.getItem('room')!
        );
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  constructor() {
    this.start();
    this.connection.on('CreateRoom', (waitingFor: Number) => {
      this.waitingFor$.next(waitingFor);
    });
    this.connection.on('GameLobby', (waitingFor: Number) => {
      if (waitingFor == 0) {
        this.router.navigate(['/game']);
      } else {
        this.router.navigate(['/lobby']);
      }
      this.waitingFor$.next(waitingFor);
    });

    this.connection.on(
      'LoadMolePage',
      (players: string[], remainingVotes: Number) => {
        this.isMole$.next(true);
        this.players$.next(players);
        this.remainingVotes$.next(remainingVotes);
      }
    );

    this.connection.on(
      'LoadInnocentPage',
      (location: string, players: string[], remainingVotes: Number) => {
        this.location$.next(location);
        this.isMole$.next(false);
        this.players$.next(players);
        this.remainingVotes$.next(remainingVotes);
      }
    );

    this.connection.on('NameTaken', () => {
      localStorage.clear();
      this.message$.next('This username is taken!');
    });

    this.connection.on('FullGame', () => {
      localStorage.clear();
      this.message$.next('This game is full!');
    });

    this.connection.on('GameDoesntExist', () => {
      localStorage.clear();
      this.message$.next("This game doesn't exist!");
    });

    this.connection.on(
      'Guessed',
      (
        result: Number,
        mole: string,
        location: string,
        guessedLocation: string
      ) => {
        this.result$.next(result);
        this.mole$.next(mole);
        this.location$.next(location);
        this.guessedLocation$.next(guessedLocation);
        this.router.navigate(['game-over']);
      }
    );

    this.connection.on('VotePage', (remainingVotes: number) => {
      this.finalRemainingVotes$.next(remainingVotes);
      this.router.navigate(['/vote']);
    });

    this.connection.on('VoteRequest', (remainingVotes: number) => {
      this.remainingVotes$.next(remainingVotes);
    });

    this.connection.on('NewMessage', (messages) => {
      this.messages$.next(messages);
    });

    this.connection.on(
      'Refresh',
      (
        remainingPlayers: number,
        messages: any[],
        isMole: boolean,
        location: string,
        players: string[],
        hasVoted: boolean,
        remainingVotes: number,
        remainingFinalVotes: number,
        vFor: string
      ) => {
        this.location$.next(location);
        this.waitingFor$.next(remainingPlayers);
        this.isMole$.next(isMole);
        this.players$.next(players);
        this.hasVoted$.next(hasVoted);
        this.remainingVotes$.next(remainingVotes);
        this.messages$.next(messages);
        this.finalRemainingVotes$.next(remainingFinalVotes);
        this.votedFor$.next(vFor);
      }
    );

    this.connection.on('NewVote', (remainingVotes: number) => {
      this.finalRemainingVotes$.next(remainingVotes);
    });

    this.connection.on('Voted', (vFor: string) => {
      this.hasVoted$.next(true);
      this.votedFor$.next(vFor);
    });

    this.connection.on(
      'VoteOver',
      (result: Number, mole: string, location: string, voteResult: any[]) => {
        this.result$.next(result);
        this.mole$.next(mole);
        this.location$.next(location), this.voteResult$.next(voteResult);
        this.router.navigate(['game-over']);
      }
    );
  }

  public async createRoom(name: string, roomName: string, capacity: number) {
    return this.connection.invoke('CreateRoom', { name, roomName, capacity });
  }

  public async joinRoom(name: string, roomName: string) {
    localStorage.setItem('user', name);
    localStorage.setItem('room', roomName);
    return this.connection.invoke('JoinRoom', { name, roomName });
  }

  reconnect(name: string, roomName: string) {
    return this.connection.invoke('Reconnect', { name, roomName });
  }

  requestVote(name: string, roomName: string) {
    return this.connection.invoke('RequestVote', { name, roomName });
  }

  sendMessage(name: string, roomName: string, content: string) {
    return this.connection.invoke('SendMessage', { name, roomName }, content);
  }

  vote(name: string, roomName: string, votedFor: string) {
    return this.connection.invoke('Vote', { name, roomName }, votedFor);
  }

  guess(name: string, roomName: string, guessedLocation: string) {
    return this.connection.invoke('Guess', { name, roomName }, guessedLocation);
  }
}
