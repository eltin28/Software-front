import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearProductoDTO } from '../dto/producto/crear-producto-dto';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { EditarProductoDTO } from '../dto/producto/editar-producto-dto';
import { ImagenDTO } from '../dto/producto/imagen-dto';
import { MostrarPedidoDTO } from '../dto/pedido/mostrar-pedido-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminURL = 'https://renechardon.onrender.com/api/admin'; 
  // private adminURL = 'http://localhost:8081/api/admin'; // Cambia esto a tu URL de backend

  constructor(private http: HttpClient) {}

  // ==================== IMÁGENES ==================== //

  public subirImagen(imagen: FormData): Observable<MensajeDTO<ImagenDTO>> {
    return this.http.post<MensajeDTO<ImagenDTO>>(`${this.adminURL}/imagenes`, imagen);
  }

  public eliminarImagen(idImagen: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/imagenes/${idImagen}`);
  }

  // ==================== PRODUCTOS ==================== //

  public crearProducto(crearProductoDTO: CrearProductoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.adminURL}/producto`, crearProductoDTO);
  }

  public actualizarProducto(id: string, editarProductoDTO: EditarProductoDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.adminURL}/producto/${id}`, editarProductoDTO);
  }

  public eliminarProducto(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/eliminar-producto/${id}`);
  }

  // ==================== PEDIDOS ==================== //

  // Ver pedido (admin)
  verPedidoAdmin(idPedido: string): Observable<MensajeDTO<MostrarPedidoDTO>> {
    return this.http.get<MensajeDTO<MostrarPedidoDTO>>(`${this.adminURL}/pedido/${idPedido}`);
  }

  // Eliminar pedido (admin)
  eliminarPedidoAdmin(idPedido: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.adminURL}/eliminar-pedido/${idPedido}`);
  }

}