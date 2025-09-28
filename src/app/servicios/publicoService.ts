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
export class publicoService {


    private readonly baseUrl = `${environment.apiUrl}/publico`;

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<MensajeDTO<ItemProductoDTO[]>> {
    return this.http.get<MensajeDTO<ItemProductoDTO[]>>(`${this.baseUrl}/productos`);
  }

  obtenerProductosPorTipo(tipo: TipoProducto): Observable<MensajeDTO<ItemProductoDTO[]>> {
    return this.http.get<MensajeDTO<ItemProductoDTO[]>>(`${this.baseUrl}/tipo/${tipo}`);
  }

  obtenerProductoPorId(id: string): Observable<MensajeDTO<ProductoDetalleDTO>> {
    return this.http.get<MensajeDTO<ProductoDetalleDTO>>(`${this.baseUrl}/${id}`);
  }

  // ==================== PAGOS (WEBHOOK) ==================== //

  // Recibir notificación de MercadoPago
  recibirNotificacionMercadoPago(payload: any): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/pagos/notificacion`, payload);
  }

}
