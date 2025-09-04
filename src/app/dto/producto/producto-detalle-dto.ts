import { TipoProducto } from "../../model/enums/TipoProducto";

export interface ProductoDetalleDTO {
  idProducto: string;
  nombreProducto: string;
  imagenProducto: string;
  cantidad: number;
  ultimaFechaModificacion: string; // LocalDateTime se mapea a string en JSON
  valor: number;
  tipo: TipoProducto;
}