import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { ResumenInventarioDTO } from '../../../dto/inventario/resumen-inventario-dto';
import { ProductoBajoStockDTO } from '../../../dto/inventario/producto-bajo-stock-dto';
import { InformacionCuentaDTO } from '../../../dto/usuario/informacion-usuario-dto';
import { ItemProductoDTO } from '../../../dto/producto/item-producto-dto';
import { MostrarLoteDTO } from '../../../dto/lote/mostrar-lote-dto';
import { LotePorVencerDTO } from '../../../dto/lote/lote-por-vencer-dto';
import { EstadoLote } from '../../../model/enums/EstadoLote';
import { AdminService } from '../../../servicios/admin';
import { EncargadoAlmacenService } from '../../../servicios/encargado-almacen-service';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { PublicoService } from '../../../servicios/publicoService';

@Component({
  selector: 'app-admin-home',
  imports: [RouterModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {

  // Signals para datos del backend
  readonly resumenInventario = signal<ResumenInventarioDTO[]>([]);
  readonly productosBajoStock = signal<ProductoBajoStockDTO[]>([]);
  readonly trabajadores = signal<InformacionCuentaDTO[]>([]);
  readonly productos = signal<ItemProductoDTO[]>([]);
  readonly lotesDisponibles = signal<MostrarLoteDTO[]>([]);
  readonly lotesEnProduccion = signal<MostrarLoteDTO[]>([]);
  readonly lotesPorVencer = signal<LotePorVencerDTO[]>([]);
  
  readonly cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Computed signals para indicadores (derivados de datos reales)
  readonly totalProductos = computed(() => this.productos().length);
  
  readonly productosInventario = computed(() => this.resumenInventario().length);
  
  readonly stockTotal = computed(() => 
    this.resumenInventario().reduce((acc, item) => acc + item.stockTotal, 0)
  );
  
  readonly lotesRegistrados = computed(() => 
    this.resumenInventario().reduce((acc, item) => acc + item.lotesDisponibles, 0)
  );
  
  readonly vencenEn7Dias = computed(() => {
    const hoy = new Date();
    const limite = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.resumenInventario().filter(item => {
      if (!item.proximoVencimiento) return false;
      const vencimiento = new Date(item.proximoVencimiento);
      return vencimiento >= hoy && vencimiento <= limite;
    }).length;
  });
  
  readonly totalLotes = computed(() => this.resumenInventario().reduce((acc, item) => acc + item.lotesDisponibles, 0));
  
  readonly lotesEnProduccionCount = computed(() => this.lotesEnProduccion().length);
  
  readonly lotesPorVencerCount = computed(() => this.lotesPorVencer().length);

  constructor(
    private adminService: AdminService,
    private almacenService: EncargadoAlmacenService,
    private supervisorService: SupervisorProduccionService,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosGenerales();
  }

  /**
   * Carga todos los datos del dashboard en paralelo usando forkJoin
   * Esto mejora significativamente el tiempo de carga
   */
  private cargarDatosGenerales(): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      resumen: this.almacenService.obtenerResumenInventario().pipe(
        catchError(err => {
          console.error('Error al cargar resumen inventario:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      stockBajo: this.almacenService.obtenerProductosBajoStock(10).pipe(
        catchError(err => {
          console.error('Error al cargar productos bajo stock:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      trabajadores: this.adminService.listarTrabajadores().pipe(
        catchError(err => {
          console.error('Error al cargar trabajadores:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      lotes: this.supervisorService.listarLotesDisponibles().pipe(
        catchError(err => {
          console.error('Error al cargar lotes:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      productos: this.publicoService.listarProductos().pipe(
        catchError(err => {
          console.error('Error al cargar productos:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      lotesDisponibles: this.supervisorService.listarLotesDisponibles().pipe(
        catchError(err => {
          console.error('Error al cargar lotes disponibles:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      lotesProduccion: this.supervisorService.listarLotesPorEstado(EstadoLote.EN_PRODUCCION).pipe(
        catchError(err => {
          console.error('Error al cargar lotes en producción:', err);
          return of({ error: true, respuesta: [] });
        })
      ),
      porVencer: this.supervisorService.obtenerLotesPorVencer(7).pipe(
        catchError(err => {
          console.error('Error al cargar lotes por vencer:', err);
          return of({ error: true, respuesta: [] });
        })
      )
    }).subscribe({
      next: (respuestas) => {
        this.procesarRespuestas(respuestas);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error crítico al cargar datos:', err);
        this.error.set('Error al conectar con el servidor. Por favor, intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Procesa las respuestas del forkJoin y actualiza los signals
   * Separación de responsabilidades: procesamiento vs carga de datos
   */
  private procesarRespuestas(respuestas: any): void {
    if (!respuestas.resumen.error) {
      this.resumenInventario.set(respuestas.resumen.respuesta || []);
    }
    
    if (!respuestas.stockBajo.error) {
      this.productosBajoStock.set(respuestas.stockBajo.respuesta || []);
    }
    
    if (!respuestas.trabajadores.error) {
      this.trabajadores.set(respuestas.trabajadores.respuesta || []);
    }
    
    if (!respuestas.lotes.error) {
      this.resumenInventario.set(respuestas.lotes.respuesta || []);
    }
    
    if (!respuestas.productos.error) {
      this.productos.set(respuestas.productos.respuesta || []);
    }
    
    if (!respuestas.lotesDisponibles.error) {
      this.lotesDisponibles.set(respuestas.lotesDisponibles.respuesta || []);
    }
    
    if (!respuestas.lotesProduccion.error) {
      this.lotesEnProduccion.set(respuestas.lotesProduccion.respuesta || []);
    }
    
    if (!respuestas.porVencer.error) {
      this.lotesPorVencer.set(respuestas.porVencer.respuesta || []);
    }
  }

  /**
   * Recarga todos los datos del dashboard
   */
  recargarDatos(): void {
    this.cargarDatosGenerales();
  }
}
