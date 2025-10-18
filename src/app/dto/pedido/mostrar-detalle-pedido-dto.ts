import { TipoProducto } from "../../model/enums/TipoProducto";

export interface MostrarDetallePedidoDTO {
  idProducto: string;
  nombreProducto: string;
  tipoProducto: TipoProducto;
  imagenProducto: string;
  precioUnitario: number;
  subtotal: number;
  idLote: string;
  codigoLote: string;
  fechaVencimiento: string;   // LocalDate → string (ISO: 'yyyy-MM-dd')
}
