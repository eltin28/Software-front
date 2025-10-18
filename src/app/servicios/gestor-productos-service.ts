import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearProductoDTO } from '../dto/producto/crear-producto-dto';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { EditarProductoDTO } from '../dto/producto/editar-producto-dto';
import { ImagenDTO } from '../dto/producto/imagen-dto';

@Injectable({
  providedIn: 'root'
})
export class GestorProductosService {

  private readonly baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  // ==================== CRUD DE PRODUCTOS ==================== //

  /**
   * Crea un nuevo producto
   */
  crearProducto(crearProductoDTO: CrearProductoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.baseUrl}`, crearProductoDTO);
  }

  /**
   * Actualiza un producto existente
   */
  actualizarProducto(id: string, editarProductoDTO: EditarProductoDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.baseUrl}/${id}`, editarProductoDTO);
  }

  /**
   * Elimina un producto por su ID
   */
  eliminarProducto(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/${id}`);
  }

  // ==================== GESTIÓN DE IMÁGENES ==================== //

  /**
   * Sube una imagen al proveedor configurado (Cloudinary)
   */
  subirImagen(imagen: FormData): Observable<MensajeDTO<ImagenDTO>> {
    return this.http.post<MensajeDTO<ImagenDTO>>(`${this.baseUrl}/imagenes`, imagen);
  }

  /**
   * Elimina una imagen por su publicId
   */
  eliminarImagen(idImagen: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/imagenes/${idImagen}`);
  }
}