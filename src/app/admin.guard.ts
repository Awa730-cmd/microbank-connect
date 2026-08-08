import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

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