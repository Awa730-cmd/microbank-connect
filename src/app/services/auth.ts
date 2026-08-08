import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'CLIENT' | 'AGENT' | 'GESTIONNAIRE';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signaux réactifs pour l'état de connexion et l'utilisateur courant
  estConnecte = signal<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  roleActuel = signal<string | null>(localStorage.getItem('userRole'));
  currentUser = signal<string>(localStorage.getItem('userRole') || 'GESTIONNAIRE');

  // "base de données" simulée d'utilisateurs
  private utilisateurs = [
    { email: 'client@microbank.com', mdp: 'client123', role: 'CLIENT', redirection: '/client-space' },
    { email: 'agent@microbank.com', mdp: 'agent123', role: 'AGENT', redirection: '/operations' },
    { email: 'admin@microbank.com', mdp: 'admin123', role: 'GESTIONNAIRE', redirection: '/dashboard' }
  ];

  constructor(private router: Router) {}

  login(email: string, mdp: string): boolean {
    const utilisateur = this.utilisateurs.find(u => u.email === email && u.mdp === mdp);

    if (utilisateur) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', utilisateur.role);

      this.estConnecte.set(true);
      this.roleActuel.set(utilisateur.role);
      this.currentUser.set(utilisateur.role);

      this.router.navigate([utilisateur.redirection]);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    this.estConnecte.set(false);
    this.roleActuel.set(null);
    this.currentUser.set('');

    this.router.navigate(['/login']);
  }

  changerProfil(role: string, redirection: string) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    this.roleActuel.set(role);
    this.currentUser.set(role);
    this.estConnecte.set(true);
    this.router.navigate([redirection]);
  }
}