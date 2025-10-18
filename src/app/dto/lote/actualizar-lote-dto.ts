// src/app/core/models/actualizar-lote.dto.ts
import { EstadoLote } from "../../model/enums/EstadoLote";

export interface ActualizarLoteDTO {
  codigoLote?: string;          // opcional
  idProducto?: string;          // opcional
  fechaProduccion?: string;     // LocalDate → string (ISO: 'yyyy-MM-dd')
  fechaVencimiento?: string;    // LocalDate → string (ISO: 'yyyy-MM-dd')
  cantidadProducida?: number;   // opcional
  cantidadDisponible?: number;  // opcional
  estado?: EstadoLote;          // opcional
  observaciones?: string;       // opcional
  motivo: string;               // obligatorio
}
