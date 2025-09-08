import { MostrarDetallePedidoDTO } from ".//mostrar-detalle-pedido-dto";
import { PagoDTO } from "./pago-dto";

export interface PedidoResponseDTO {
  idPedido: string;
  idCliente: string;
  fecha: string; // OffsetDateTime → string
  total: number; // BigDecimal → number
  detalles: MostrarDetallePedidoDTO[];
  pago: PagoDTO;
}