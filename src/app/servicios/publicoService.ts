import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { Observable } from 'rxjs';
import { ItemProductoDTO } from '../dto/producto/item-producto-dto';
import { ProductoDetalleDTO } from '../dto/producto/producto-detalle-dto';
import { TipoProducto } from '../model/enums/TipoProducto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicoService {

  private readonly baseUrl = `${environment.apiUrl}/publico`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos los productos disponibles
   */
  listarProductos(): Observable<MensajeDTO<ItemProductoDTO[]>> {
    return this.http.get<MensajeDTO<ItemProductoDTO[]>>(`${this.baseUrl}/productos`);
  }


  //_____________________________________________FALTA POR IMPLEMENTAR______________________________________________
  /**
   * Obtiene productos filtrados por tipo (FACIAL, CORPORAL, CAPILAR)
   */
  obtenerProductosPorTipo(tipo: TipoProducto): Observable<MensajeDTO<ItemProductoDTO[]>> {
    return this.http.get<MensajeDTO<ItemProductoDTO[]>>(`${this.baseUrl}/productos/tipo/${tipo}`);
  }

  /**
   * Obtiene el detalle completo de un producto por su ID
   */
  obtenerProductoPorId(id: string): Observable<MensajeDTO<ProductoDetalleDTO>> {
    return this.http.get<MensajeDTO<ProductoDetalleDTO>>(`${this.baseUrl}/productos/${id}`);
  }
}