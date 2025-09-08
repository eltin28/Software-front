import { TipoProducto } from "../../model/enums/TipoProducto";

export interface MostrarDetallePedidoDTO {
  idProducto: string;
  nombreProducto: string;
  tipoProducto: TipoProducto;
  imagenProducto: string;
  precioUnitario: number; // BigDecimal → number
  cantidad: number;
  subtotal: number; // BigDecimal → number
}
