import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { Router } from '@angular/router';
import { TimerResetService } from '../servicios/timer-reset.service';
import { EMPTY } from 'rxjs';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const timerResetService = inject(TimerResetService);

  const isApiAuth = req.url.includes("api/auth");
  const isApiPublico = req.url.includes("api/publico");

  if (isApiAuth || isApiPublico) {
    return next(req);
  }

  if (!tokenService.isLogged()) {
    router.navigate(['/login']);
    //return next(req);
    return EMPTY;
  }

  // Resetear el timer de inactividad en cada request
  timerResetService.resetInactivityTimer();

  const token = tokenService.getToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
