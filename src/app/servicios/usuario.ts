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

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly baseUrl = 'https://renechardon.onrender.com/api/usuarios';
  //private readonly baseUrl = 'http://localhost:8081/api/usuarios'
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
    return this.http.delete<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/mi-carrito/vaciar`)
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

  // Listar pedidos del cliente
  listarPedidosCliente(): Observable<MensajeDTO<MostrarPedidoDTO[]>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO[]>>(`${this.baseUrl}/pedido`);
  }

  // Crear pedido desde carrito
  crearPedidoDesdeCarrito(): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.post<MensajeDTO<MostrarPedidoDTO>>(
      `${this.baseUrl}/orden/crear-pedido`,
      {}
    );
  }


  // Ver detalle de pedido
  verDetallePedido(idPedido: string): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO>>(`${this.baseUrl}/detalle/${idPedido}`);
  }

  iniciarPago(idPedido: string): Observable<MensajeDTO<PreferenceDTO>> {
    return this.http.post<MensajeDTO<PreferenceDTO>>(`${this.baseUrl}/pago/${idPedido}`, {});
  }

  // Eliminar pedido del cliente
  eliminarPedidoCliente(idPedido: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/eliminar-pedido/${idPedido}`);
  }
}
