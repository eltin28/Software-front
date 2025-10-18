import { TipoProducto } from "../../model/enums/TipoProducto";

export interface CrearProductoDTO {
  nombre: string;
  imagenProducto: string;
  descripcion: string;
  valor: number;
  tipo: TipoProducto;
}