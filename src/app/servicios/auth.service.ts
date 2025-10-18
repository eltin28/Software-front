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
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authURL = `${environment.apiUrl}/auth`;
  private readonly EMAIL_TEMP_KEY = 'emailTemp';

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService, 
    private router: Router
  ) {}

  // ==================== GESTIÓN DE EMAIL TEMPORAL ==================== //

  /**
   * Guarda el email temporalmente para el flujo de registro/recuperación
   */
  setEmailTemp(email: string): void {
    sessionStorage.setItem(this.EMAIL_TEMP_KEY, email);
  }

  /**
   * Obtiene el email temporal guardado
   */
  getEmailTemp(): string {
    return sessionStorage.getItem(this.EMAIL_TEMP_KEY) || '';
  }

  /**
   * Limpia el email temporal
   */
  clearEmailTemp(): void {
    sessionStorage.removeItem(this.EMAIL_TEMP_KEY);
  }

  // ==================== ENDPOINTS DE AUTENTICACIÓN ==================== //

  /**
   * Crea una nueva cuenta de usuario
   */
  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }

  /**
   * Valida el código de activación enviado al correo
   */
  public validarCodigo(validarCodigoDTO: ValidarCodigoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/validar-codigo`, validarCodigoDTO);
  }

  /**
   * Envía un código de recuperación de contraseña al email
   */
  public enviarCodigoRecuperacion(codigoContraseniaDTO: CodigoContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/codigo-recuperacion-contasenia`, codigoContraseniaDTO);
  }

  /**
   * Cambia la contraseña usando el código de recuperación
   */
  public cambiarPassword(cambiarPasswordDTO: CambiarPasswordDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-password`, cambiarPasswordDTO);
  }

  /**
   * Inicia sesión y obtiene el token JWT
   */
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    this.clearEmailTemp();
    this.tokenService.logout();
  }
}