export interface ResumenInventarioDTO {
  idProducto: string;
  nombreProducto: string;
  stockTotal: number;
  lotesDisponibles: number;
  proximoVencimiento: string; // LocalDate → string (formato ISO: 'yyyy-MM-dd')
}
