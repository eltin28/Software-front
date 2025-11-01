import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { MostrarPedidoDTO } from '../dto/pedido/mostrar-pedido-dto';
import { environment } from '../../environments/environment';
import { CrearTrabajadorDTO } from '../dto/usuario/crear-trabajador-dto';
import { InformacionCuentaDTO } from '../dto/usuario/informacion-usuario-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly adminURL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // ==================== PEDIDOS (Solo Admin) ==================== //

  /**
   * Ver cualquier pedido sin restricciones (acceso administrativo)
   */
  verPedido(idPedido: string): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO>>(`${this.adminURL}/pedidos/${idPedido}`);
  }

  /**
   * Eliminar cualquier pedido del sistema
   */
  eliminarPedido(idPedido: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/pedidos/${idPedido}`);
  }

   // ==================== TRABAJADORES (Solo Admin) ==================== //

  /**
   * Crea un nuevo trabajador (empleado) en el sistema
   * Roles permitidos: GESTOR_PRODUCTOS, SUPERVISOR_PRODUCCION, ENCARGADO_ALMACEN, ADMINISTRADOR
   */
  crearTrabajador(trabajadorDTO: CrearTrabajadorDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.adminURL}/trabajadores`, trabajadorDTO);
  }

  /**
   * Lista todos los trabajadores (usuarios con roles diferentes a CLIENTE)
   */
  listarTrabajadores(): Observable<MensajeDTO<InformacionCuentaDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCuentaDTO[]>>(`${this.adminURL}/trabajadores`);
  }

  /**
   * Obtiene la información de un trabajador específico
   */
  obtenerTrabajador(idTrabajador: string): Observable<MensajeDTO<InformacionCuentaDTO>> {
    return this.http.get<MensajeDTO<InformacionCuentaDTO>>(`${this.adminURL}/trabajadores/${idTrabajador}`);
  }

  /**
   * Desactiva (elimina lógicamente) la cuenta de un trabajador
   */
  desactivarTrabajador(idTrabajador: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/trabajadores/${idTrabajador}`);
  }
}