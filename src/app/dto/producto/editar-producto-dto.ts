import { TipoProducto } from "../../model/enums/TipoProducto";

export interface EditarProductoDTO {
  nombre: string;
  imagenProducto: string;
  descripcion: string;
  valor: number;
  tipo: TipoProducto;
}