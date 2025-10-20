import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { StockPorLoteDTO } from '../../../dto/inventario/stock-por-lote-dto';
import { MensajeDTO } from '../../../dto/autenticacion/mensaje-dto';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';

@Component({
  selector: 'app-stock-detallado',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './stock-detallado.html',
  styleUrl: './stock-detallado.css'
})
export class StockDetallado {
  private service = inject(EncargadoAlmacenService);

  resumenProductos = signal<ResumenInventarioDTO[]>([]);
  stockPorLote = signal<StockPorLoteDTO[]>([]);
  productoSeleccionado = signal<string>('');
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.service.obtenerResumenInventario().subscribe({
      next: resp => this.resumenProductos.set(resp.respuesta),
      error: err => this.error.set(err.error?.mensaje || 'Error al cargar productos.')
    });
  }

  buscarStock(): void {
    const idProducto = this.productoSeleccionado();
    if (!idProducto) return;

    this.cargando.set(true);
    this.error.set(null);

    this.service.obtenerStockPorLote(idProducto).subscribe({
      next: resp => {
        this.stockPorLote.set(resp.respuesta);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err.error?.mensaje || 'Error al obtener stock.');
        this.cargando.set(false);
      }
    });
  }

  estaVencido(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }
}