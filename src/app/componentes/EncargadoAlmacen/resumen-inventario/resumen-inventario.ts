import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';

@Component({
  selector: 'app-resumen-inventario',
  imports: [ CommonModule],
  templateUrl: './resumen-inventario.html',
  styleUrl: './resumen-inventario.css'
})
export class ResumenInventario implements OnInit {

  resumenInventario = signal<ResumenInventarioDTO[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private almacenService: EncargadoAlmacenService) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  private cargarResumen(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.almacenService.obtenerResumenInventario().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.resumenInventario.set(resp.respuesta || []);
        } else {
          this.error.set('Error al cargar resumen de inventario');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al obtener inventario:', err);
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });
  }

  recargar(): void {
    this.cargarResumen();
  }

  // resumen-inventario.component.ts
  esProximoAVencer(fecha: string | null): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const limite = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const vencimiento = new Date(fecha);
    return vencimiento >= hoy && vencimiento <= limite;
  }
}