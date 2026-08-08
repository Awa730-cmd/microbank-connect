import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, Role } from '../../services/auth';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parametres.html'
})
export class Parametres {
  authService = inject(AuthService);

  changerRole(role: Role, redirection: string) {
    this.authService.changerProfil(role, redirection);
  }
}