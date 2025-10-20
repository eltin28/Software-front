import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { ProductoBajoStockDTO } from '../../../dto/inventario/producto-bajo-stock-dto';

@Component({
  selector: 'app-alertas-stock-bajo',
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas-stock-bajo.html',
  styleUrl: './alertas-stock-bajo.css'
})
export class AlertasStockBajo implements OnInit {

  productos = signal<ProductoBajoStockDTO[]>([]);
  umbral = signal<number>(10);
  cargando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  // Propiedad auxiliar para ngModel
  umbralInput: number = this.umbral();

  constructor(private almacenService: EncargadoAlmacenService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.cargando.set(true);
    this.almacenService.obtenerProductosBajoStock(this.umbral()).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          this.productos.set(resp.respuesta);
        } else {
          this.error.set('Error al cargar productos con stock bajo');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });
  }

  actualizarUmbral(): void {
    this.umbral.set(this.umbralInput);
    this.cargarAlertas();
  }
}