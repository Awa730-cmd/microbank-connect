import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Indispensable pour ngModel et ngIf
  templateUrl: './login.html'
})
export class LoginComponent {
  // Injection du service d'authentification
  authService = inject(AuthService);

  // Variables pour stocker ce que l'utilisateur tape
  email: string = '';
  mdp: string = '';
  messageErreur: string = '';

  // Fonction déclenchée quand on clique sur "Se connecter"
  seConnecter() {
    this.messageErreur = ''; // On réinitialise l'erreur

    // On envoie les données au service
    const succes = this.authService.login(this.email, this.mdp);

    // Si ça échoue, on affiche un message
    if (!succes) {
      this.messageErreur = 'Email ou mot de passe incorrect. Veuillez réessayer.';
    }
  }
}
