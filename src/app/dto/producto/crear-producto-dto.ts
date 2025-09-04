import { TipoProducto } from "../../model/enums/TipoProducto";

export interface CrearProductoDTO {
    nombre: string;
    imagenProducto: string;
    cantidad: number;
    valor: number;
    tipo: TipoProducto;
}
