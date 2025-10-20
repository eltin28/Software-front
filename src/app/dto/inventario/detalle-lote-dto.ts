import { EstadoLote } from '../../model/enums/EstadoLote';

export interface DetalleLoteDTO {
  idLote: string;
  idProducto: string;
  nombreProducto: string;
  cantidadDisponible: number;
  fechaVencimiento: string; // LocalDate → ISO string
  estado: EstadoLote;
}
