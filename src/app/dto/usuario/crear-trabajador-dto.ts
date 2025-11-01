import { Rol } from '../../model/enums/Rol';

export interface CrearTrabajadorDTO {
  cedula: string;
  nombre: string;
  telefono: string;
  correoElectronico: string;
  contrasenia: string;
  rol: Rol;
  ciudadDeResidencia?: string;
  direccion?: string;
}
