import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/autenticacion/mensaje-dto';
import { CrearLoteDTO } from '../dto/lote/crear-lote-dto';
import { MostrarLoteDTO } from '../dto/lote/mostrar-lote-dto';
import { ActualizarLoteDTO } from '../dto/lote/actualizar-lote-dto';
import { LotePorVencerDTO } from '../dto/lote/lote-por-vencer-dto';
import { EstadoLote } from '../model/enums/EstadoLote';

@Injectable({
  providedIn: 'root'
})
export class SupervisorProduccionService {

  private readonly baseUrl = `${environment.apiUrl}/lotes`;

  constructor(private http: HttpClient) {}

  // ==================== CRUD DE LOTES ==================== //

  /**
   * Crea un nuevo lote de producción con estado EN_PRODUCCION
   */
  crearLote(crearLoteDTO: CrearLoteDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.baseUrl}`, crearLoteDTO);
  }

  /**
   * Obtiene el detalle de un lote por su ID
   */
  obtenerLote(idLote: string): Observable<MensajeDTO<MostrarLoteDTO>> {
    return this.http.get<MensajeDTO<MostrarLoteDTO>>(`${this.baseUrl}/${idLote}`);
  }

  /**
   * Actualiza un lote existente
   * Requiere especificar motivo para auditoría
   */
  actualizarLote(idLote: string, actualizarLoteDTO: ActualizarLoteDTO): Observable<MensajeDTO<MostrarLoteDTO>> {
    return this.http.put<MensajeDTO<MostrarLoteDTO>>(`${this.baseUrl}/${idLote}`, actualizarLoteDTO);
  }

  /**
   * Elimina un lote
   * Solo permite eliminar lotes sin ventas asociadas y que no estén DISPONIBLES
   */
  eliminarLote(idLote: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.baseUrl}/${idLote}`);
  }

  // ==================== GESTIÓN DE ESTADO ==================== //

  /**
   * Bloquea un lote impidiendo su venta
   * Útil para control de calidad o problemas detectados
   */
  bloquearLote(idLote: string, motivo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('motivo', motivo);
    return this.http.patch<MensajeDTO<string>>(`${this.baseUrl}/${idLote}/bloquear`, null, { params });
  }

  /**
   * Desbloquea un lote previamente bloqueado
   * Permite su venta nuevamente
   */
  desbloquearLote(idLote: string): Observable<MensajeDTO<string>> {
    return this.http.patch<MensajeDTO<string>>(`${this.baseUrl}/${idLote}/desbloquear`, null);
  }

  // ==================== CONSULTAS Y REPORTES ==================== //

  /**
   * Lista todos los lotes de un producto específico
   */
  listarLotesPorProducto(idProducto: string): Observable<MensajeDTO<MostrarLoteDTO[]>> {
    return this.http.get<MensajeDTO<MostrarLoteDTO[]>>(`${this.baseUrl}/producto/${idProducto}`);
  }

  /**
   * Lista todos los lotes con estado DISPONIBLE y cantidad > 0
   */
  listarLotesDisponibles(): Observable<MensajeDTO<MostrarLoteDTO[]>> {
    return this.http.get<MensajeDTO<MostrarLoteDTO[]>>(`${this.baseUrl}/disponibles`);
  }

  /**
   * Obtiene lotes próximos a vencer
   * @param diasUmbral - Número de días para el umbral (default: 60)
   */
  obtenerLotesPorVencer(diasUmbral: number = 60): Observable<MensajeDTO<LotePorVencerDTO[]>> {
    const params = new HttpParams().set('diasUmbral', diasUmbral.toString());
    return this.http.get<MensajeDTO<LotePorVencerDTO[]>>(`${this.baseUrl}/alertas/por-vencer`, { params });
  }

  /**
   * Lista lotes filtrados por estado
   * @param estado - EN_PRODUCCION, DISPONIBLE, AGOTADO, BLOQUEADO
   */
  listarLotesPorEstado(estado: EstadoLote): Observable<MensajeDTO<MostrarLoteDTO[]>> {
    return this.http.get<MensajeDTO<MostrarLoteDTO[]>>(`${this.baseUrl}/estado/${estado}`);
  }
}