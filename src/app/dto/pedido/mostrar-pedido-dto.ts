import { MostrarDetallePedidoDTO } from "./mostrar-detalle-pedido-dto";

export interface MostrarPedidoDTO {
  idPedido: string;
  nombreCliente: string;
  fechaCompra: string;
  total: number;
  detalles: MostrarDetallePedidoDTO[];
}