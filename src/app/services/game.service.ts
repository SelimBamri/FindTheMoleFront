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
  public isMole$ = new BehaviorSubject<boolean>(false);
  public location$ = new BehaviorSubject<string | null>(null);
  public players$ = new BehaviorSubject<any>(null);
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

    this.connection.on('LoadMolePage', () => {
      this.isMole$.next(true);
    });

    this.connection.on('LoadInnocentPage', (location: string) => {
      this.location$.next(location);
      this.isMole$.next(false);
    });

    this.connection.on(
      'Refresh',
      (
        remainingPlayers: number,
        messages: any[],
        isMole: boolean,
        location: string
      ) => {
        this.location$.next(location);
        this.waitingFor$.next(remainingPlayers);
        this.isMole$.next(isMole);
        console.log(this.connection.connectionId);
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
}
