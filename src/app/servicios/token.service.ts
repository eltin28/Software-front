import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenData } from '../dto/autenticacion/TokenData';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = "AuthToken";
  private readonly router = inject(Router);

  public isLoggedSignal = signal<boolean>(this.isLogged());

  public setToken(token: string) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedSignal.set(true);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  public isLogged(): boolean {
    return !!this.getToken();
  }

  public login(token: string) {
    this.setToken(token);
    const rol = this.getRol();
    
    // Redirigir según rol
    let destino: string;
    
    switch(rol) {
      case 'ADMINISTRADOR':
        destino = '/admin/dashboard';
        break;
      case 'GESTOR_PRODUCTOS':
        destino = '/gestor/productos';
        break;
      case 'SUPERVISOR_PRODUCCION':
        destino = '/supervisor/lotes';
        break;
      case 'ENCARGADO_ALMACEN':
        destino = '/almacen/inventario';
        break;
      case 'CLIENTE':
      default:
        destino = '/home';
        break;
    }
    
    this.router.navigate([destino]).then(() => window.location.reload());
  }

  public logout() {
    sessionStorage.clear();
    this.isLoggedSignal.set(false);
    this.router.navigate(["/login"]);
  }

  private decodePayload(token: string): any {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  }

  public getAllTokenData(): TokenData {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return {
        id: values.id,
        nombre: values.nombre,
        rol: values.rol
      };
    }
    return { id: '', nombre: '', rol: '' };
  }

  public getRol(): string {
    return this.getAllTokenData().rol;
  }

  public hasRole(...roles: string[]): boolean {
    const userRole = this.getRol();
    return roles.includes(userRole);
  }

  public isWorker(): boolean {
    return this.hasRole('GESTOR_PRODUCTOS', 'SUPERVISOR_PRODUCCION', 'ENCARGADO_ALMACEN', 'ADMINISTRADOR');
  }
}