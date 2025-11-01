import { Rol } from "../../model/enums/Rol";

export interface InformacionCuentaDTO {
    id: string,
    cedula: string,
    nombre: string,
    telefono: string,
    correoElectronico: string,
    rol: Rol;
}
