import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InformacionCuentaDTO } from '../dto/cuenta/informacion-cuenta-dto';

const TOKEN_KEY = "AuthToken";


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  public setToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  

  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  public login(token: string) {
    this.setToken(token);
    const rol = this.getRol();
    let destino = rol == "ADMINISTRADOR" ? "/home-admin" : "/home-cliente";
    this.router.navigate([destino]).then(() => {
      window.location.reload();
    });
   }
   

 public logout() {
  window.sessionStorage.clear();
  this.router.navigate(["/login"]).then(() => {
    window.location.reload();
  });
  }

  private decodePayload(token: string): any {
    const payload = token!.split(".")[1];
    const payloadDecoded = atob(payload); // alternativa más ligera en navegadores
    const values = JSON.parse(payloadDecoded);
    return values;
  }
  

// Leer datos del usuario
 
 public getRol(): string {
  const token = this.getToken();
  if (token) {
    const values = this.decodePayload(token);
    return values.rol;
  }
  return "";
 }
 
   //Con la funcion getAllTokenData simplifico la creacion de funciones para obtener datos separados
   public getAllTokenData(): InformacionCuentaDTO {
    const token = this.getToken(); // Asume que getToken devuelve el token JWT
    if (token) {
      const decodedValues = this.decodePayload(token); // Usa decodePayload para obtener el payload decodificado
      return {
        id: decodedValues.id,
        cedula: decodedValues.cedula,
        nombre: decodedValues.nombre,
        telefono: decodedValues.telefono,
        email: decodedValues.email
      };
    }
    return { id: '', cedula: '', nombre: '', telefono: '', email: '' };
  }
}