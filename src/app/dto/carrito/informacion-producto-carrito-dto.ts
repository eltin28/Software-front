import { DetalleCarritoDTO } from './detalle-carrito-dto';

export interface InformacionProductoCarritoDTO {
  detalleCarritoDTO: DetalleCarritoDTO;
  imagenProducto: string;
  nombre: string;
  valorUnitario: number;
  subtotal: number;
}