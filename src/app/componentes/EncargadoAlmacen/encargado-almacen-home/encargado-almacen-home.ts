import { Component, OnInit, signal, computed  } from '@angular/core';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';
import { ProductoBajoStockDTO } from '../../../dto/inventario/producto-bajo-stock-dto';

@Component({
  selector: 'app-encargado-almacen-home',
  imports: [],
  templateUrl: './encargado-almacen-home.html',
  styleUrl: './encargado-almacen-home.css'
})
export class EncargadoAlmacenHome implements OnInit {

  resumenInventario = signal<ResumenInventarioDTO[]>([]);
  productosBajoStock = signal<ProductoBajoStockDTO[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  // Indicadores calculados con computed
  totalProductos = computed(() => this.resumenInventario().length);
  
  totalStock = computed(() => 
    this.resumenInventario().reduce((acc, item) => acc + item.stockTotal, 0)
  );
  
  totalLotes = computed(() => 
    this.resumenInventario().reduce((acc, item) => acc + item.lotesDisponibles, 0)
  );
  
  proximosVencimientos = computed(() => {
    const hoy = new Date();
    const limite = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.resumenInventario().filter(item => {
      if (!item.proximoVencimiento) return false;
      const vencimiento = new Date(item.proximoVencimiento);
      return vencimiento >= hoy && vencimiento <= limite;
    }).length;
  });

  constructor(private almacenService: EncargadoAlmacenService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.almacenService.obtenerResumenInventario().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.resumenInventario.set(resp.respuesta || []);
          this.cargarAlertas();
        } else {
          this.error.set('Error al cargar el resumen de inventario');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar resumen:', err);
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });
  }

  private cargarAlertas(): void {
    this.almacenService.obtenerProductosBajoStock().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productosBajoStock.set(resp.respuesta || []);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar alertas:', err);
        this.cargando.set(false);
      }
    });
  }

  recargarDatos(): void {
    this.cargarDatos();
  }
}