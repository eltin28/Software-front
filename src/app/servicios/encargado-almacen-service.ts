import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { ResumenInventarioDTO } from '../dto/inventario/resumen-inventario-dto';
import { StockPorLoteDTO } from '../dto/inventario/stock-por-lote-dto';
import { ProductoBajoStockDTO } from '../dto/inventario/producto-bajo-stock-dto';
import { DetalleLoteDTO } from '../dto/inventario/detalle-lote-dto';

@Injectable({
  providedIn: 'root'
})
export class EncargadoAlmacenService {

  private readonly baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  // ==================== CONSULTAS DE INVENTARIO ==================== //

  /**
   * Obtiene el stock total disponible de un producto
   * (suma de todos los lotes disponibles y no vencidos)
   */
  obtenerStockDisponible(idProducto: string): Observable<MensajeDTO<number>> {
    return this.http.get<MensajeDTO<number>>(`${this.baseUrl}/stock/${idProducto}`);
  }

  /**
   * Obtiene el resumen general del inventario con stock total,
   * cantidad de lotes y próximo vencimiento por producto
   */
  obtenerResumenInventario(): Observable<MensajeDTO<ResumenInventarioDTO[]>> {
    return this.http.get<MensajeDTO<ResumenInventarioDTO[]>>(`${this.baseUrl}/resumen`);
  }

  /**
   * Obtiene el detalle de stock por cada lote de un producto
   */
  obtenerStockPorLote(idProducto: string): Observable<MensajeDTO<StockPorLoteDTO[]>> {
    return this.http.get<MensajeDTO<StockPorLoteDTO[]>>(`${this.baseUrl}/stock-detallado/${idProducto}`);
  }

  /**
   * Lista productos con stock bajo según el umbral especificado
   */
  obtenerProductosBajoStock(umbral: number = 10): Observable<MensajeDTO<ProductoBajoStockDTO[]>> {
    return this.http.get<MensajeDTO<ProductoBajoStockDTO[]>>(`${this.baseUrl}/alertas/stock-bajo`, {
      params: { umbral: umbral.toString() }
    });
  }

  listarLotes(): Observable<MensajeDTO<DetalleLoteDTO[]>> {
  return this.http.get<MensajeDTO<DetalleLoteDTO[]>>(`${this.baseUrl}/lotes`);
}

  // ==================== OPERACIONES DE ALMACÉN ==================== //

  /**
   * Registra la entrada de un lote de producción al almacén físico
   */
  registrarEntradaAlmacen(idLote: string): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.baseUrl}/registrar-entrada/${idLote}`, {});
  }
}