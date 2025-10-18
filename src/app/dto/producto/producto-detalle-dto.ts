import { TipoProducto } from "../../model/enums/TipoProducto";

export interface ProductoDetalleDTO {
  idProducto: string;
  nombreProducto: string;
  imagenProducto: string;
  descripcion: string;
  ultimaFechaModificacion: string; // LocalDateTime → ISO string
  valor: number;
  tipo: TipoProducto;
}