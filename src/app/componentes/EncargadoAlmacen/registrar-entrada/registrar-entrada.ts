import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';
import { DetalleLoteDTO } from '../../../dto/inventario/detalle-lote-dto';

@Component({
  selector: 'app-registrar-entrada',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './registrar-entrada.html',
  styleUrl: './registrar-entrada.css'
})
export class RegistrarEntrada implements OnInit {

  private readonly almacenService = inject(EncargadoAlmacenService);

  lotesPendientes = signal<DetalleLoteDTO[]>([]);
  loteSeleccionado = signal<string>('');
  cargando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarLotesPendientes();
  }

cargarLotesPendientes(): void {
  this.cargando.set(true);
  this.error.set(null);
  this.mensaje.set(null);

  this.almacenService.listarLotes().subscribe({
    next: ({ error, respuesta }) => {
      if (!error && respuesta) {
        const pendientes = respuesta.filter(lote => lote.cantidadDisponible === 0);
        this.lotesPendientes.set(pendientes);
      } else {
        this.error.set('Error al cargar lotes pendientes');
      }
      this.cargando.set(false);
    },
    error: (err) => {
      console.error('Error cargando lotes:', err);
      this.error.set('No se pudo conectar con el servidor');
      this.cargando.set(false);
    }
  });
}

registrarEntrada(): void {
  const idLote = this.loteSeleccionado();
  if (!idLote) {
    this.error.set('Debe seleccionar un lote para registrar la entrada');
    return;
  }

  this.cargando.set(true);
  this.error.set(null);
  this.mensaje.set(null);

  this.almacenService.registrarEntradaAlmacen(idLote).subscribe({
    next: ({ error, respuesta }) => {
      if (!error) {
        this.mensaje.set(respuesta ?? 'Entrada registrada correctamente');
        this.cargarLotesPendientes();
        this.loteSeleccionado.set('');
      } else {
        this.error.set('Error al registrar la entrada');
      }
      this.cargando.set(false);
    },
    error: (err) => {
      console.error('Error al registrar entrada:', err);
      this.error.set('No se pudo registrar la entrada');
      this.cargando.set(false);
    }
  });
}

}
