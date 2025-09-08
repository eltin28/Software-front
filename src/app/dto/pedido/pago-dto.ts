import { EstadoPago } from "../../model/enums/EstadoPago";
import { Moneda } from "../../model/enums/Moneda";
import { TipoPago } from "../../model/enums/TipoPago";

export interface PagoDTO {
  idPago: string;
  moneda: Moneda;
  tipoPago: TipoPago;
  detalleEstado: string;
  codigoAutorizacion: string;
  fecha: string; // OffsetDateTime → string en JSON
  valorTransaccion: number; // BigDecimal → number en TS
  estado: EstadoPago;
  metodoPago: string;
}