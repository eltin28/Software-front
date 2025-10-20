import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { MostrarLoteDTO } from '../../../dto/lote/mostrar-lote-dto';
import { EstadoLote } from '../../../model/enums/EstadoLote';
import { GestorProductosService } from '../../../servicios/gestor-productos-service';
import { PublicoService } from '../../../servicios/publicoService';

@Component({
  selector: 'app-listar-lotes',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-lotes.html',
  styleUrl: './listar-lotes.css'
})
export class ListarLotes implements OnInit {

  // Datos
  todosLosLotes = signal<MostrarLoteDTO[]>([]);
  productos = signal<any[]>([]);
  
  // Estados
  cargando = signal(true);
  error = signal<string | null>(null);

  // Filtros
  busqueda = signal('');
  estadoFiltro = signal<EstadoLote | ''>('');
  productoFiltro = signal('');

  // Modal de confirmación
  mostrarModalEliminar = signal(false);
  loteAEliminar = signal<MostrarLoteDTO | null>(null);

  // Modal de bloqueo
  mostrarModalBloqueo = signal(false);
  loteABloquear = signal<MostrarLoteDTO | null>(null);
  motivoBloqueo = signal('');

  // Estados disponibles para el filtro
  estadosLote = Object.values(EstadoLote);

  // Lotes filtrados
  lotesFiltrados = computed(() => {
    let lotes = this.todosLosLotes();

    // Filtrar por búsqueda (código de lote)
    const termino = this.busqueda().toLowerCase().trim();
    if (termino) {
      lotes = lotes.filter(lote => 
        lote.codigoLote.toLowerCase().includes(termino)
      );
    }

    // Filtrar por estado
    const estado = this.estadoFiltro();
    if (estado) {
      lotes = lotes.filter(lote => lote.estado === estado);
    }

    // Filtrar por producto
    const producto = this.productoFiltro();
    if (producto) {
      lotes = lotes.filter(lote => lote.idProducto === producto);
    }

    return lotes;
  });

  // Estadísticas
  totalLotes = computed(() => this.lotesFiltrados().length);
  
  lotesDisponibles = computed(() => 
    this.lotesFiltrados().filter(l => l.estado === EstadoLote.DISPONIBLE).length
  );
  
  lotesEnProduccion = computed(() => 
    this.lotesFiltrados().filter(l => l.estado === EstadoLote.EN_PRODUCCION).length
  );
  
  lotesBloqueados = computed(() => 
    this.lotesFiltrados().filter(l => l.estado === EstadoLote.BLOQUEADO).length
  );

  constructor(
    private supervisorService: SupervisorProduccionService,
    private productosService: GestorProductosService,
    private publico: PublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    // Cargar todos los lotes disponibles
    this.supervisorService.listarLotesDisponibles().subscribe({
      next: (resp) => {
        if (!resp.error) {
          const lotesDisponibles = resp.respuesta || [];
          this.cargarLotesPorEstado(lotesDisponibles);
        } else {
          this.error.set('Error al cargar lotes');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar lotes:', err);
        this.error.set('No se pudo conectar con el servidor');
        this.cargando.set(false);
      }
    });

    // Cargar productos para el filtro
    this.cargarProductos();
  }

  private cargarLotesPorEstado(lotesIniciales: MostrarLoteDTO[]): void {
    const lotesAcumulados = [...lotesIniciales];
    let completados = 0;
    const totalEstados = 3;

    // Cargar lotes EN_PRODUCCION
    this.supervisorService.listarLotesPorEstado(EstadoLote.EN_PRODUCCION).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          lotesAcumulados.push(...resp.respuesta);
        }
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      },
      error: () => {
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      }
    });

    // Cargar lotes BLOQUEADOS
    this.supervisorService.listarLotesPorEstado(EstadoLote.BLOQUEADO).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          lotesAcumulados.push(...resp.respuesta);
        }
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      },
      error: () => {
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      }
    });

    // Cargar lotes AGOTADOS
    this.supervisorService.listarLotesPorEstado(EstadoLote.AGOTADO).subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          lotesAcumulados.push(...resp.respuesta);
        }
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      },
      error: () => {
        completados++;
        if (completados === totalEstados) {
          this.todosLosLotes.set(lotesAcumulados);
          this.cargando.set(false);
        }
      }
    });
  }

  private cargarProductos(): void {
    this.publico.listarProductos().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productos.set(resp.respuesta || []);
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  recargarDatos(): void {
    this.cargarDatos();
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.estadoFiltro.set('');
    this.productoFiltro.set('');
  }

  verDetalle(idLote: string): void {
    this.router.navigate(['/supervisor/lotes', idLote]);
  }

  editarLote(idLote: string): void {
    this.router.navigate(['/supervisor/lotes/editar', idLote]);
  }

  abrirModalBloqueo(lote: MostrarLoteDTO): void {
    this.loteABloquear.set(lote);
    this.motivoBloqueo.set('');
    this.mostrarModalBloqueo.set(true);
  }

  cerrarModalBloqueo(): void {
    this.mostrarModalBloqueo.set(false);
    this.loteABloquear.set(null);
    this.motivoBloqueo.set('');
  }

  bloquearLote(): void {
    const lote = this.loteABloquear();
    const motivo = this.motivoBloqueo().trim();

    if (!lote || !motivo) {
      return;
    }

    this.supervisorService.bloquearLote(lote.id, motivo).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.cerrarModalBloqueo();
          this.cargarDatos();
        } else {
          this.error.set(resp.respuesta || 'Error al bloquear el lote');
        }
      },
      error: (err) => {
        console.error('Error al bloquear lote:', err);
        this.error.set('No se pudo bloquear el lote');
      }
    });
  }

  desbloquearLote(lote: MostrarLoteDTO): void {
    if (!confirm(`¿Desbloquear el lote ${lote.codigoLote}?`)) {
      return;
    }

    this.supervisorService.desbloquearLote(lote.id).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.cargarDatos();
        } else {
          this.error.set(resp.respuesta || 'Error al desbloquear el lote');
        }
      },
      error: (err) => {
        console.error('Error al desbloquear lote:', err);
        this.error.set('No se pudo desbloquear el lote');
      }
    });
  }

  abrirModalEliminar(lote: MostrarLoteDTO): void {
    this.loteAEliminar.set(lote);
    this.mostrarModalEliminar.set(true);
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar.set(false);
    this.loteAEliminar.set(null);
  }

  confirmarEliminar(): void {
    const lote = this.loteAEliminar();
    if (!lote) return;

    this.supervisorService.eliminarLote(lote.id).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.cerrarModalEliminar();
          this.cargarDatos();
        } else {
          this.error.set(resp.respuesta || 'Error al eliminar el lote');
          this.cerrarModalEliminar();
        }
      },
      error: (err) => {
        console.error('Error al eliminar lote:', err);
        this.error.set('No se pudo eliminar el lote');
        this.cerrarModalEliminar();
      }
    });
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  obtenerClaseEstado(estado: EstadoLote): string {
    return estado.toLowerCase().replace('_', '-');
  }

  obtenerTextoEstado(estado: EstadoLote): string {
    const textos: Record<EstadoLote, string> = {
      [EstadoLote.EN_PRODUCCION]: 'En Producción',
      [EstadoLote.DISPONIBLE]: 'Disponible',
      [EstadoLote.AGOTADO]: 'Agotado',
      [EstadoLote.BLOQUEADO]: 'Bloqueado'
    };
    return textos[estado] || estado;
  }

  puedeBloquear(lote: MostrarLoteDTO): boolean {
    return lote.estado !== EstadoLote.BLOQUEADO && lote.estado !== EstadoLote.AGOTADO;
  }

  puedeDesbloquear(lote: MostrarLoteDTO): boolean {
    return lote.estado === EstadoLote.BLOQUEADO;
  }

  puedeEliminar(lote: MostrarLoteDTO): boolean {
    return lote.estado !== EstadoLote.DISPONIBLE;
  }
}