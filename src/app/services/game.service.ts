import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  API_URL: string = 'https://localhost:7247';
  public waitingFor$ = new BehaviorSubject<Number>(10);

  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.API_URL}/game`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

  public async start() {
    try {
      await this.connection.start();
    } catch (error) {
      console.log(error);
    }
  }

  constructor() {
    this.start();
    this.connection.on('CreateRoom', (waitingFor: Number) => {
      this.waitingFor$.next(waitingFor);
    });

    this.connection.on('GameLobby', (waitingFor: Number) => {
      this.waitingFor$.next(waitingFor);
    });
  }

  public async createRoom(name: string, roomName: string, capacity: number) {
    return this.connection.invoke('CreateRoom', { name, roomName, capacity });
  }

  public async joinRoom(name: string, roomName: string) {
    return this.connection.invoke('JoinRoom', { name, roomName });
  }
}
