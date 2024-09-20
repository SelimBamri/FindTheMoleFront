import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { GameLobbyComponent } from './game-lobby/game-lobby.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { GameComponent } from './game/game.component';
import { VotePageComponent } from './vote-page/vote-page.component';
import { GameOverComponent } from './game-over/game-over.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'new-game', component: CreateGameComponent },
  { path: 'join-game', component: JoinGameComponent },
  { path: 'lobby', component: GameLobbyComponent },
  { path: 'game', component: GameComponent },
  { path: 'vote', component: VotePageComponent },
  { path: 'game-over', component: GameOverComponent },
];
