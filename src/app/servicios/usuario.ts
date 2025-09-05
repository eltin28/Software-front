import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { CarritoDTO } from '../dto/carrito/carrito-dto';
import { CarritoResponseDTO } from '../dto/carrito/carrito-response-dto';
import { DetalleCarritoDTO } from '../dto/carrito/detalle-carrito-dto';
import { InformacionProductoCarritoDTO } from '../dto/carrito/informacion-producto-carrito-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly baseUrl = 'http://localhost:8081/api/usuarios';

  constructor(private http: HttpClient) {}

  // Agregar ítems al carrito
  agregarItemsAlCarrito(idUsuario: string, items: DetalleCarritoDTO[]): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.post<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/${idUsuario}/items`, items);
  }

  // Eliminar ítem del carrito
  eliminarItemDelCarrito(idUsuario: string, idProducto: string): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.delete<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/${idUsuario}/items/${idProducto}`);
  }

  // Vaciar carrito
  vaciarCarrito(idUsuario: string): Observable<MensajeDTO<CarritoDTO>> {
    return this.http.delete<MensajeDTO<CarritoDTO>>(`${this.baseUrl}/${idUsuario}/vaciar`);
  }

  // Listar productos dentro del carrito
  listarProductosEnCarrito(idUsuario: string): Observable<MensajeDTO<InformacionProductoCarritoDTO[]>> {
    return this.http.get<MensajeDTO<InformacionProductoCarritoDTO[]>>(`${this.baseUrl}/${idUsuario}/items`);
  }

  // Calcular total del carrito
  calcularTotalCarrito(idUsuario: string): Observable<MensajeDTO<number>> {
    return this.http.get<MensajeDTO<number>>(`${this.baseUrl}/${idUsuario}/total`);
  }

  // Obtener carrito completo (con items y total)
  obtenerCarritoCompleto(idUsuario: string): Observable<MensajeDTO<CarritoResponseDTO>> {
    return this.http.get<MensajeDTO<CarritoResponseDTO>>(`${this.baseUrl}/${idUsuario}`);
  }
}
