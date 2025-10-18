import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { MostrarPedidoDTO } from '../dto/pedido/mostrar-pedido-dto';
import { environment } from '../../environments/environment';

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
}