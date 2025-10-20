import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../servicios/token.service';

/**
 * Guard que permite acceso solo a usuarios NO autenticados o CLIENTES
 * Bloquea el acceso a trabajadores (GESTOR_PRODUCTOS, SUPERVISOR_PRODUCCION, ENCARGADO_ALMACEN, ADMINISTRADOR)
 */
export const ClienteOnlyGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Permitir acceso si no está logueado
  if (!tokenService.isLogged()) {
    return true;
  }

  const rol = tokenService.getRol();

  // Permitir solo si es CLIENTE
  if (rol === 'CLIENTE') {
    return true;
  }

  // Bloquear a trabajadores y redirigir a su home
  switch(rol) {
    case 'ADMINISTRADOR':
      router.navigate(['/admin/dashboard']);
      break;
    case 'GESTOR_PRODUCTOS':
      router.navigate(['/gestor/home']);
      break;
    case 'SUPERVISOR_PRODUCCION':
      router.navigate(['/supervisor/home']);
      break;
    case 'ENCARGADO_ALMACEN':
      router.navigate(['/almacen/home']);
      break;
    default:
      router.navigate(['/login']);
      break;
  }
  
  return false;
};