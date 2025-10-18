// src/app/core/models/mostrar-lote.dto.ts
import { EstadoLote } from "../../model/enums/EstadoLote";

export interface MostrarLoteDTO {
  id: string;
  codigoLote: string;
  idProducto: string;
  nombreProducto: string;
  fechaProduccion: string;    // LocalDate → string (ISO)
  fechaVencimiento: string;   // LocalDate → string (ISO)
  cantidadProducida: number;
  cantidadDisponible: number;
  cantidadVendida: number;
  estado: EstadoLote;
  observaciones: string;
  proximoAVencer: boolean;
  diasParaVencer: number;
}
