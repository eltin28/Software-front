import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { CarritoDTO } from '../dto/carrito/carrito-dto';
import { CarritoResponseDTO } from '../dto/carrito/carrito-response-dto';
import { DetalleCarritoDTO } from '../dto/carrito/detalle-carrito-dto';
import { InformacionProductoCarritoDTO } from '../dto/carrito/informacion-producto-carrito-dto';
import { MostrarPedidoDTO } from '../dto/pedido/mostrar-pedido-dto';
import { PreferenceDTO } from '../dto/pedido/preference-dto';
import { environment } from '../../environments/environment';
import { InformacionCuentaDTO } from '../dto/usuario/informacion-usuario-dto';
import { EditarCuentaDTO } from '../dto/usuario/editar-usuario-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  public readonly cartItemCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  /**
   * Refresca el contador de productos en el carrito desde el backend.
   */
  cargarCantidadCarrito(): void {
    this.obtenerCarritoCompleto().subscribe();
  }

  private refrescarCantidadCarrito(): void {
    this.cargarCantidadCarrito();
  }

    // ==================== PERFIL ==================== //

  /**
   * Obtiene la información del perfil del usuario autenticado
   */
  obtenerPerfil(): Observable<MensajeDTO<InformacionCuentaDTO>> {
    return this.http.get<MensajeDTO<InformacionCuentaDTO>>(`${this.baseUrl}/perfil`);
  }

  /**
   * Edita el perfil del usuario autenticado
   * Solo puede editar su propio perfil (el ID se obtiene del token)
   */
  editarPerfil(usuarioDTO: EditarCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.baseUrl}/editar`, usuarioDTO);
  }

  /**
   * Elimina (desactiva) la cuenta del usuario autenticado
   */
  eliminarCuenta(): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/eliminar-cuenta`);
  }

//_______________________________ENDPOINTS CARRITO________________________________//


  // Agregar ítems al carrito
  agregarItemsAlCarrito(items: DetalleCarritoDTO[]): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.post<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/mi-carrito/items`, items)
    .pipe(
        tap(() => this.refrescarCantidadCarrito())
      );
  }

  // Eliminar ítem del carrito
  eliminarItemDelCarrito(idProducto: string): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.delete<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/mi-carrito/items/${idProducto}`)
    .pipe(
        tap(() => this.refrescarCantidadCarrito())
      );
  }

  // Vaciar carrito
  vaciarCarrito(): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.delete<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/mi-carrito`)
          .pipe(
        tap(() => this.cartItemCount.set(0))
      );
  }

  // Listar productos dentro del carrito
  listarProductosEnCarrito(): Observable<MensajeDTO<InformacionProductoCarritoDTO[]>> {
    return this.http.get<MensajeDTO<InformacionProductoCarritoDTO[]>>(`${this.baseUrl}/mi-carrito/items`);
  }

  // Calcular total del carrito
  calcularTotalCarrito(): Observable<MensajeDTO<number>> {
    return this.http.get<MensajeDTO<number>>(`${this.baseUrl}/mi-carrito/total`);
  }

  // Obtener carrito completo (con items y total)
  obtenerCarritoCompleto(): Observable<MensajeDTO<CarritoResponseDTO>> {
    return this.http.get<MensajeDTO<CarritoResponseDTO>>(`${this.baseUrl}/mi-carrito`)
    .pipe(
        tap((resp: MensajeDTO<CarritoResponseDTO>) => {
           this.cartItemCount.set(resp.respuesta.totalProductos ?? 0);
        })
      );
  }

  // ==================== PEDIDOS ==================== //

  listarPedidosCliente(): Observable<MensajeDTO<MostrarPedidoDTO[]>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO[]>>(`${this.baseUrl}/pedidos`);
  }

  crearPedidoDesdeCarrito(): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.post<MensajeDTO<MostrarPedidoDTO>>(
      `${this.baseUrl}/pedidos`,
      {}
    );
  }

  verDetallePedido(idPedido: string): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO>>(`${this.baseUrl}/pedidos/${idPedido}`);
  }

  iniciarPago(idPedido: string): Observable<MensajeDTO<PreferenceDTO>> {
    return this.http.post<MensajeDTO<PreferenceDTO>>(`${this.baseUrl}/pedidos/${idPedido}/pago`, {});
  }

  eliminarPedidoCliente(idPedido: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/pedidos/${idPedido}`);
  }
}
