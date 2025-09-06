import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../servicios/token.service';

export const AuthGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLogged()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Guard para rutas públicas (evitar acceso si ya está autenticado)
export const PublicGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isLogged()) {
    return true;
  }

  router.navigate(['/']); // Redirige al home si ya está logueado
  return false;
};