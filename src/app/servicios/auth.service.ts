import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../servicios/token.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { LoginDTO } from '../dto/usuario/login-dto';
import { CrearCuentaDTO } from '../dto/usuario/crear-usuario-dto';
import { ValidarCodigoDTO } from '../dto/usuario/validar-codigo-dto';
import { CambiarPasswordDTO } from '../dto/usuario/cambiar-password-dto';
import { CodigoContraseniaDTO } from '../dto/usuario/codigo-contrasenia-dto';
import { TokenDTO } from '../dto/autenticacion/token-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authURL = "https://renechardon.onrender.com/api/auth";
  private authURL = 'http://localhost:8081/api/auth'; // Cambia esto a tu URL de backend

  private emailTemp: string;

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {
    this.emailTemp = this.getEmailTemp();
  }


  setEmailTemp(email: string) {
    this.emailTemp = email;
  }

  getEmailTemp() {
    return this.emailTemp;
  }


  //_______________________________ METODOS CUENTA _____________________________________________

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }

  public validarCodigo(validarCodigoDTO: ValidarCodigoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/validar-codigo`, validarCodigoDTO);
  }

  public enviarCodigoRecuperacion(codigoContraseniaDTO: CodigoContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/codigo-recuperacion-contasenia`, codigoContraseniaDTO);
  }

  public cambiarPassword(cambiarPasswordDTO: CambiarPasswordDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-password`, cambiarPasswordDTO);
  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

}
