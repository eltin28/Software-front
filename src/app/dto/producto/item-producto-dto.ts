import { TipoProducto } from "../../model/enums/TipoProducto";

export interface ItemProductoDTO {
  idProducto: string;
  nombreProducto: string;
  imagenProducto: string;
  descripcion: string;
  valor: number;
  tipo: TipoProducto;
}