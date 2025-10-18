import { EstadoLote } from '../../model/enums/EstadoLote';

export interface StockPorLoteDTO {
  codigoLote: string;
  cantidad: number;
  fechaVencimiento: string; // LocalDate → string (ISO: 'yyyy-MM-dd')
  estado: EstadoLote;
}