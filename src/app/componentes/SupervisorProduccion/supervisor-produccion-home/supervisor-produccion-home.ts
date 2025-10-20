import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { MostrarLoteDTO } from '../../../dto/lote/mostrar-lote-dto';
import { LotePorVencerDTO } from '../../../dto/lote/lote-por-vencer-dto';
import { EstadoLote } from '../../../model/enums/EstadoLote';

@Component({
  selector: 'app-supervisor-produccion-home',
  imports: [ RouterModule ],
  templateUrl: './supervisor-produccion-home.html',
  styleUrl: './supervisor-produccion-home.css'
})
export class SupervisorProduccionHome implements OnInit {

  lotesDisponibles = signal<MostrarLoteDTO[]>([]);
  lotesPorVencer = signal<LotePorVencerDTO[]>([]);
  lotesEnProduccion = signal<MostrarLoteDTO[]>([]);
  lotesBloqueados = signal<MostrarLoteDTO[]>([]);
  
  cargando = signal(true);
  error = signal<string | null>(null);

  // Indicadores calculados con computed
  totalLotes = computed(() => 
    this.lotesDisponibles().length + 
    this.lotesEnProduccion().length + 
    this.lotesBloqueados().length
  );
  
  lotesActivos = computed(() => 
    this.lotesDisponibles().length + this.lotesEnProduccion().length
  );
  
  stockTotal = computed(() => 
    this.lotesDisponibles().reduce((acc, lote) => acc + lote.cantidadDisponible, 0)
  );
  
  alertasVencimiento = computed(() => this.lotesPorVencer().length);

  // Para mostrar los últimos lotes creados
  ultimosLotes = computed(() => {
    const todos = [...this.lotesEnProduccion(), ...this.lotesDisponibles()]
      .sort((a, b) => new Date(b.fechaProduccion).getTime() - new Date(a.fechaProduccion).getTime());
    return todos.slice(0, 5);
  });

  constructor(
    private supervisorService: SupervisorProduccionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    // Cargar lotes disponibles
    this.supervisorService.listarLotesDisponibles().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.lotesDisponibles.set(resp.respuesta || []);
          this.cargarLotesEnProduccion();
        } else {
          this.error.set('Error al cargar lotes disponibles');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar lotes disponibles:', err);
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });
  }

  private cargarLotesEnProduccion(): void {
    this.supervisorService.listarLotesPorEstado(EstadoLote.EN_PRODUCCION).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.lotesEnProduccion.set(resp.respuesta || []);
          this.cargarLotesBloqueados();
        } else {
          this.cargarLotesBloqueados();
        }
      },
      error: (err) => {
        console.error('Error al cargar lotes en producción:', err);
        this.cargarLotesBloqueados();
      }
    });
  }

  private cargarLotesBloqueados(): void {
    this.supervisorService.listarLotesPorEstado(EstadoLote.BLOQUEADO).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.lotesBloqueados.set(resp.respuesta || []);
          this.cargarAlertasVencimiento();
        } else {
          this.cargarAlertasVencimiento();
        }
      },
      error: (err) => {
        console.error('Error al cargar lotes bloqueados:', err);
        this.cargarAlertasVencimiento();
      }
    });
  }

  private cargarAlertasVencimiento(): void {
    this.supervisorService.obtenerLotesPorVencer(30).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.lotesPorVencer.set(resp.respuesta || []);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar alertas de vencimiento:', err);
        this.cargando.set(false);
      }
    });
  }

  recargarDatos(): void {
    this.cargarDatos();
  }

  verDetalleLote(idLote: string): void {
    this.router.navigate(['/supervisor/lotes', idLote]);
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  calcularDiasRestantes(fechaVencimiento: string | Date): number {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  obtenerEstiloVencimiento(dias: number): string {
    if (dias <= 7) return 'critico';
    if (dias <= 15) return 'advertencia';
    return 'normal';
  }

    crearLote(): void {
    this.router.navigate(['/supervisor/lotes/crear']);
  }

  verTodosLotes(): void {
    this.router.navigate(['/supervisor/lotes/listar-lotes']);
  }

  verAlertas(): void {
    this.router.navigate(['/supervisor/alertas']);
  }

  verReportes(): void {
    this.router.navigate(['/supervisor/reportes']);
  }
}