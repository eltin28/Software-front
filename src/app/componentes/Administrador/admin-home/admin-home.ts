import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../servicios/admin';
import { InformacionCuentaDTO } from '../../../dto/usuario/informacion-usuario-dto';
import { AdminSubnavComponent } from '../subnav-admin/subnav-admin';

type TabType = 'resumen' | 'trabajadores' | 'productos' | 'produccion' | 'almacen';

interface EstadisticasDashboard {
  totalProductos: number;
  totalTrabajadores: number;
  totalLotes: number;
  totalStock: number;
  pedidosPendientes: number;
  alertasStock: number;
}

const ROL_CLASES: Record<string, string> = {
  ADMINISTRADOR: 'admin',
  GESTOR_PRODUCTOS: 'gestor',
  SUPERVISOR_PRODUCCION: 'supervisor',
  ENCARGADO_ALMACEN: 'almacen'
};

const ROL_NOMBRES: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  GESTOR_PRODUCTOS: 'Gestor de Productos',
  SUPERVISOR_PRODUCCION: 'Supervisor de Producción',
  ENCARGADO_ALMACEN: 'Encargado de Almacén'
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSubnavComponent],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.css']
})
export class AdminHome implements OnInit {
  
  readonly tabActiva = signal<TabType>('resumen');
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly listaTrabajadores = signal<InformacionCuentaDTO[]>([]);
  readonly cargandoTrabajadores = signal(false);
  readonly errorTrabajadores = signal<string | null>(null);

  readonly estadisticas = signal<EstadisticasDashboard>({
    totalProductos: 0,
    totalTrabajadores: 0,
    totalLotes: 0,
    totalStock: 0,
    pedidosPendientes: 0,
    alertasStock: 0
  });

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.recargarDatos();
  }

  /**
   * Handler para cuando el subnav cambia de tab
   */
  onTabChange(tab: TabType): void {
    this.tabActiva.set(tab);
    
    // Cargar datos específicos de la tab si es necesario
    if (tab === 'trabajadores' && this.listaTrabajadores().length === 0) {
      this.cargarTrabajadores();
    }
  }

  /**
   * Navega a una tab específica (usado por acciones rápidas)
   */
  navegarA(tab: TabType): void {
    this.tabActiva.set(tab);
    
    const rutas: Record<TabType, string> = {
      resumen: '/admin/home',
      trabajadores: '/admin/trabajadores',
      productos: '/gestor/home',
      produccion: '/supervisor/home',
      almacen: '/almacen/home'
    };
    
    this.router.navigateByUrl(rutas[tab]);
  }

  recargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.cargarTrabajadores();
    this.estadisticas.set({
      totalProductos: 245,
      totalTrabajadores: 0,
      totalLotes: 156,
      totalStock: 8450,
      pedidosPendientes: 89,
      alertasStock: 3
    });
    this.cargando.set(false);
  }

  cargarTrabajadores(): void {
    this.cargandoTrabajadores.set(true);
    this.errorTrabajadores.set(null);

    this.adminService.listarTrabajadores().subscribe({
      next: (resp) => {
        this.listaTrabajadores.set(resp.respuesta);
        this.estadisticas.update(s => ({
          ...s,
          totalTrabajadores: resp.respuesta.length
        }));
        this.cargandoTrabajadores.set(false);
      },
      error: () => {
        this.errorTrabajadores.set('No se pudieron cargar los trabajadores.');
        this.cargandoTrabajadores.set(false);
      }
    });
  }

  obtenerClaseRol(rol: string): string {
    return ROL_CLASES[rol] ?? 'gestor';
  }

  obtenerNombreRol(rol: string): string {
    return ROL_NOMBRES[rol] ?? rol;
  }

  abrirModalCrearTrabajador(): void {
    alert('Funcionalidad de crear trabajador pendiente.');
  }

  verDetallesTrabajador(trabajador: InformacionCuentaDTO): void {
    alert(`Detalles de: ${trabajador.nombre}`);
  }

  desactivarTrabajador(trabajador: InformacionCuentaDTO): void {
    if (confirm(`¿Desactivar a ${trabajador.nombre}?`)) {
      alert('Funcionalidad pendiente.');
    }
  }

  navegarAGestorProductos(): void {
    this.router.navigate(['/gestor/home']);
  }

  navegarASupervisorProduccion(): void {
    this.router.navigate(['/supervisor/home']);
  }

  navegarAAlmacen(): void {
    this.router.navigate(['/almacen/home']);
  }
}
