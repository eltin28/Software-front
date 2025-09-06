import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { Router } from '@angular/router';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const isApiAuth = req.url.includes("api/auth");
  const isApiPublico = req.url.includes("api/publico");

  if (isApiAuth || isApiPublico) {
    return next(req);
  }

  if (!tokenService.isLogged()) {
    // Redirigir a login y cancelar la request
    router.navigate(['/login']);
    return next(req);
  }

  const token = tokenService.getToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};