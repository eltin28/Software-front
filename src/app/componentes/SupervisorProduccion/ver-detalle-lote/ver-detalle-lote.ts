import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { MostrarLoteDTO } from '../../../dto/lote/mostrar-lote-dto';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-ver-detalle-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule],
  templateUrl: './ver-detalle-lote.html',
  styleUrl: './ver-detalle-lote.css'
})
export class VerDetalleLote implements OnInit {

  lote = signal<MostrarLoteDTO | null>(null);
  cargando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  idLote = '';
  modoEdicion = signal(false);

  // Propiedades normales (no signals)
  motivo: string = '';
  loteEditado: Partial<MostrarLoteDTO> = {};

  constructor(
    private route: ActivatedRoute,
    private produccionService: SupervisorProduccionService
  ) {}

  ngOnInit(): void {
    this.idLote = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.idLote) this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.cargando.set(true);
    this.produccionService.obtenerLote(this.idLote).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) this.lote.set(resp.respuesta);
        else this.error.set('Error al obtener detalle del lote');
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });
  }

  bloquear(): void {
    if (!this.motivo.trim()) {
      this.error.set('Debe indicar un motivo');
      return;
    }
    this.cargando.set(true);
    this.produccionService.bloquearLote(this.idLote, this.motivo).subscribe({
      next: (resp) => {
        this.mensaje.set(resp.respuesta);
        this.cargarDetalle();
        this.motivo = '';
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al bloquear el lote');
        this.cargando.set(false);
      }
    });
  }

  desbloquear(): void {
    this.cargando.set(true);
    this.produccionService.desbloquearLote(this.idLote).subscribe({
      next: (resp) => {
        this.mensaje.set(resp.respuesta);
        this.cargarDetalle();
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al desbloquear el lote');
        this.cargando.set(false);
      }
    });
  }

  eliminar(): void {
    if (!confirm('¿Seguro que desea eliminar este lote?')) return;
    this.cargando.set(true);
    this.produccionService.eliminarLote(this.idLote).subscribe({
      next: (resp) => {
        this.mensaje.set(resp.respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al eliminar el lote');
        this.cargando.set(false);
      }
    });
  }

}
