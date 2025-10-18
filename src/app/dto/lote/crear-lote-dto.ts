export interface CrearLoteDTO {
  codigoLote: string;
  idProducto: string;
  fechaProduccion: string;    // LocalDate → string (ISO: 'yyyy-MM-dd')
  fechaVencimiento: string;   // LocalDate → string (ISO: 'yyyy-MM-dd')
  cantidadProducida: number;
  observaciones?: string;     // opcional
}
