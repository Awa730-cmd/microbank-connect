import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';



export class DashboardComponent {
  // Injection du Router d'Angular pour pouvoir rediriger
  private router = inject(Router);

  // Fonction appelée lors du clic sur le bouton de déconnexion
  deconnecter() {
    // 1. On supprime le statut de connexion du localStorage
    localStorage.removeItem('isLoggedIn');
    
    // 2. On redirige proprement l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true; // L'utilisateur est connecté, on le laisse passer
  }

  // Sinon, on bloque et on le redirige vers le login
  router.navigate(['/login']);
  return false;
};