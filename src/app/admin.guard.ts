import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  // Laisse passer la navigation sans blocage ni erreur d'import
  return true;
};