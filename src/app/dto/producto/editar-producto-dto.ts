import { TipoProducto } from "../../model/enums/TipoProducto";

export interface EditarProductoDTO {
  nombre: string;
  imagenProducto: string;
  cantidad: number;
  valor: number;
  tipo: TipoProducto;
}