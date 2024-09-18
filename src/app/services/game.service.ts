import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  API_URL: string = 'https://localhost:7247';
  public waitingFor$ = new BehaviorSubject<Number>(10);
  public remainingVotes$ = new BehaviorSubject<Number>(10);
  public isMole$ = new BehaviorSubject<boolean>(false);
  public hasVoted$ = new BehaviorSubject<boolean>(false);
  public location$ = new BehaviorSubject<string | null>(null);
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
      }
      this.waitingFor$.next(waitingFor);
    });

    this.connection.on(
      'LoadMolePage',
      (players: string[], remainingVotes: number) => {
        this.isMole$.next(true);
        this.players$.next(players);
        this.remainingVotes$.next(remainingVotes);
      }
    );

    this.connection.on(
      'LoadInnocentPage',
      (location: string, players: string[], remainingVotes: number) => {
        this.location$.next(location);
        this.isMole$.next(false);
        this.players$.next(players);
        this.remainingVotes$.next(remainingVotes);
      }
    );

    this.connection.on('VoteRequest', (remainingVotes: number) => {
      this.remainingVotes$.next(remainingVotes);
    });

    this.connection.on(
      'Refresh',
      (
        remainingPlayers: number,
        messages: any[],
        isMole: boolean,
        location: string,
        players: string[],
        voted: boolean,
        remainingVotes: number
      ) => {
        this.location$.next(location);
        this.waitingFor$.next(remainingPlayers);
        this.isMole$.next(isMole);
        this.players$.next(players);
        this.hasVoted$.next(voted);
        this.remainingVotes$.next(remainingVotes);
      }
    );
  }

  public async createRoom(name: string, roomName: string, capacity: number) {
    return this.connection.invoke('CreateRoom', { name, roomName, capacity });
  }

  public async joinRoom(name: string, roomName: string) {
    return this.connection.invoke('JoinRoom', { name, roomName });
  }

  reconnect(name: string, roomName: string) {
    return this.connection.invoke('Reconnect', { name, roomName });
  }

  requestVote(name: string, roomName: string) {
    return this.connection.invoke('RequestVote', { name, roomName });
  }
}
