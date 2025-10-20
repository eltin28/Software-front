import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';
import { StockPorLoteDTO } from '../../../dto/inventario/stock-por-lote-dto';
import { EstadoLote } from '../../../model/enums/EstadoLote';

@Component({
  selector: 'app-ver-stock-producto',
  imports: [CommonModule, DatePipe],
  templateUrl: './ver-stock-producto.html',
  styleUrl: './ver-stock-producto.css'
})
export class VerStockProducto implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly almacenService = inject(EncargadoAlmacenService);

  producto = signal<ResumenInventarioDTO | null>(null);
  lotes = signal<StockPorLoteDTO[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarDatos(id);
  }

  cargarDatos(idProducto: string): void {
    this.cargando.set(true);
    this.error.set(null);

    // 1. Obtener resumen del producto
    this.almacenService.obtenerResumenInventario().subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          const prod = resp.respuesta.find(p => p.idProducto === idProducto);
          this.producto.set(prod ?? null);
        }
      },
      error: () => this.error.set('Error al obtener resumen de producto')
    });

    // 2. Obtener detalle por lotes
    this.almacenService.obtenerStockPorLote(idProducto).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          this.lotes.set(resp.respuesta);
        } else {
          this.error.set('No se pudo cargar el detalle de lotes');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al obtener lotes');
        this.cargando.set(false);
      }
    });
  }

  esVencido(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }

  protected readonly EstadoLote = EstadoLote;
}