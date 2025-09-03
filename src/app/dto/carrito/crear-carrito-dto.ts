import { DetalleCarritoDTO } from './detalle-carrito-dto';

export interface CrearCarritoDTO {
  idUsuario: string; 
  itemsCarrito: DetalleCarritoDTO[];
}