import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenData } from '../dto/autenticacion/TokenData';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = "AuthToken";

  constructor(private router: Router) { }

  public setToken(token: string) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
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
    const destino = rol === "ADMINISTRADOR" ? "/home-admin" : "/home-cliente";
    this.router.navigate([destino]).then(() => window.location.reload());
  }

  public logout() {
    sessionStorage.clear();
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
}