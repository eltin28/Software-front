import { TipoProducto } from "../../model/enums/TipoProducto";

export interface ItemProductoDTO {
  idProducto: string;
  nombreProducto: string;
  imagenProducto: string;
  cantidad: number;
  valor: number;
  tipo: TipoProducto;
}