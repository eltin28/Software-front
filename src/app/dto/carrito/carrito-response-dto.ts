import { InformacionProductoCarritoDTO } from './informacion-producto-carrito-dto';

export interface CarritoResponseDTO {
  idCarrito: string;
  idUsuario: string;
  items: InformacionProductoCarritoDTO[];
  total: number;
  totalProductos: number;
}
