import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  router = inject(Router);

  redirectToCreateGame() {
    this.router.navigate(['/new-game']);
  }

  redirectToJoinGame() {
    this.router.navigate(['/join-game']);
  }
}
