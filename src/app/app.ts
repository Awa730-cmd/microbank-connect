import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'microbank-connect';

  constructor(private router: Router) {}

  // Permet de vérifier si l'URL actuelle est la page de login
  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }
}