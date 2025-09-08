import { DetallePedidoDTO } from "./detalle-pedido-dto";
import { PagoDTO } from "./pago-dto";

export interface CrearPedidoDTO {
  idCliente: string;
  codigoPasarela: string;
  fechaCreacion: string;   // OffsetDateTime → string
  detallePedido: DetallePedidoDTO[];
  pago: PagoDTO;
}