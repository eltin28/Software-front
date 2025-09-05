import { DetalleCarritoDTO } from './detalle-carrito-dto';

export interface CarritoDTO {
  idCarrito: string;
  idUsuario: string;
  items: DetalleCarritoDTO[];
}
