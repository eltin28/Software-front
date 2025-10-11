import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../servicios/token.service';

/*
../servicios/token.service
 */
@Component({
  selector: 'app-crear-pqr',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-pqr.html',
  styleUrls: ['./crear-pqr.css']
})
export class CrearPQRComponent {

  categorias: string[] = ['SERVICIO', 'FACTURACIÓN', 'TÉCNICO', 'OTRO'];
  estados: string[] = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

  pqr = {
    idPqr: null as number | null,
    idUsuario: null as number | null,
    categoria: '',
    descripcion: '',
    idWorker: null as number | null,
    fechaCreacion: '',
    fechaRespuesta: '',
    estadoPqr: ''
  };

  constructor(private tokenService: TokenService) {
    // 🔹 Asignar automáticamente el id del usuario logeado
    this.pqr.idUsuario = this.tokenService.getUserId();
  }

  onSubmit() {
    if (!this.pqr.idUsuario || !this.pqr.categoria || !this.pqr.descripcion || !this.pqr.estadoPqr) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    console.log('Datos enviados:', this.pqr);
    alert('PQR registrado correctamente.');
    this.resetForm();
  }

  resetForm() {
    this.pqr = {
      idPqr: null,
      idUsuario: this.tokenService.getUserId(),
      categoria: '',
      descripcion: '',
      idWorker: null,
      fechaCreacion: '',
      fechaRespuesta: '',
      estadoPqr: ''
    };
  }
}
