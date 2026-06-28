import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Buscamos el token directo en la sesión
  const token = sessionStorage.getItem('accessToken');

  // Si el token existe (aunque sea el falso de prueba), ¡PASE LIBRE!
  if (token) {
    return true;
  }

  // Si no hay token, lo mandamos al login de forma segura
  return router.createUrlTree(['/login']);
};