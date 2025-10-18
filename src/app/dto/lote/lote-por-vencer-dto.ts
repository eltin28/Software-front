export interface LotePorVencerDTO {
  codigoLote: string;
  nombreProducto: string;
  fechaVencimiento: string; // LocalDate → string (ISO: 'yyyy-MM-dd')
  cantidadDisponible: number;
  diasRestantes: number;
}
