import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { Router } from '@angular/router';
import { TimerResetService } from '../servicios/timer-reset.service';
import { catchError, throwError } from 'rxjs';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const timerResetService = inject(TimerResetService);

  const isApiAuth = req.url.includes("api/auth");
  const isApiPublico = req.url.includes("api/publico");

  // No interceptar rutas públicas
  if (isApiAuth || isApiPublico) {
    return next(req);
  }

  // Verificar si tiene token antes de hacer la petición
  if (!tokenService.isLogged()) {
    router.navigate(['/login']);
    return throwError(() => new Error('No autenticado'));
  }

  // Resetear timer de inactividad
  timerResetService.resetInactivityTimer();

  const token = tokenService.getToken();

  // Clonar petición con token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Manejar errores de autenticación del servidor
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Token inválido o expirado
        tokenService.logout(); // Limpia el token
        router.navigate(['/login']);
        return throwError(() => new Error('Sesión expirada'));
      }
      
      // Otros errores se propagan normalmente
      return throwError(() => error);
    })
  );
};