import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const isApiAuth = req.url.includes("api/auth");
  const isApiPublico = req.url.includes("api/publico");

  if (isApiAuth || isApiPublico) {
    return next(req);
  }

  if (!tokenService.isLogged()) {
    // Puedes redirigir a login o simplemente continuar sin token
    console.warn('Usuario no autenticado intentando acceder a ruta protegida');
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