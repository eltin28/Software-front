import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { StockPorLoteDTO } from '../../../dto/inventario/stock-por-lote-dto';
import { MensajeDTO } from '../../../dto/autenticacion/mensaje-dto';

@Component({
  selector: 'app-stock-detallado',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './stock-detallado.html',
  styleUrl: './stock-detallado.css'
})
export class StockDetallado implements OnInit {

  idProducto = '';
  stockPorLote = signal<StockPorLoteDTO[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(private almacenService: EncargadoAlmacenService) {}

  ngOnInit(): void {}

  buscarStock(): void {
    if (!this.idProducto.trim()) {
      this.error.set('Debe ingresar un ID de producto.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.almacenService.obtenerStockPorLote(this.idProducto).subscribe({
      next: (resp: MensajeDTO<StockPorLoteDTO[]>) => {
        this.stockPorLote.set(resp.respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al obtener el stock por lote.');
        this.cargando.set(false);
      }
    });
  }

  estaVencido(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }
}