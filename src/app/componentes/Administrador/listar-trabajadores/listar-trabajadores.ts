import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

import { InformacionCuentaDTO } from '../../../dto/usuario/informacion-usuario-dto';
import { AdminService } from '../../../servicios/admin';
import { Rol } from '../../../model/enums/Rol';

@Component({
  selector: 'app-listar-trabajadores',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './listar-trabajadores.html',
  styleUrl: './listar-trabajadores.css'
})
export class ListarTrabajadores implements OnInit {

  // Signals para estado reactivo
  readonly trabajadores = signal<InformacionCuentaDTO[]>([]);
  readonly trabajadoresFiltrados = signal<InformacionCuentaDTO[]>([]);
  readonly cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal<string>('');
  readonly rolFiltro = signal<string>('');
  readonly ordenColumna = signal<string>('');
  readonly ordenDireccion = signal<'asc' | 'desc'>('asc');

  // Computed para estadísticas
  readonly totalTrabajadores = computed(() => this.trabajadores().length);
  readonly trabajadoresFiltradosCount = computed(() => this.trabajadoresFiltrados().length);

  // Lista de roles para el filtro
  readonly rolesDisponibles = signal<string[]>([
    'TODOS',
    Rol.ADMINISTRADOR,
    Rol.GESTOR_PRODUCTOS,
    Rol.SUPERVISOR_PRODUCCION,
    Rol.ENCARGADO_ALMACEN
  ]);

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  /**
   * Carga la lista de trabajadores desde el backend
   * Manejo robusto de errores
   */
  private cargarTrabajadores(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.adminService.listarTrabajadores().subscribe({
      next: (resp) => {
        if (!resp.error) {
          const trabajadores = resp.respuesta || [];
          this.trabajadores.set(trabajadores);
          this.trabajadoresFiltrados.set(trabajadores);
        } else {
          this.error.set('Error al cargar la lista de trabajadores');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar trabajadores:', err);
        this.error.set('No se pudo conectar con el servidor. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Filtra trabajadores por término de búsqueda y rol
   * Separación de responsabilidades: lógica de filtrado
   */
  private aplicarFiltros(): void {
    let resultado = [...this.trabajadores()];

    // Filtro por texto de búsqueda
    const termino = this.searchTerm().toLowerCase().trim();
    if (termino) {
      resultado = resultado.filter(trabajador =>
        trabajador.nombre.toLowerCase().includes(termino) ||
        trabajador.correoElectronico.toLowerCase().includes(termino) ||
        trabajador.cedula.includes(termino) ||
        trabajador.telefono.includes(termino)
      );
    }

    // Filtro por rol
    const rol = this.rolFiltro();
    if (rol && rol !== 'TODOS') {
      resultado = resultado.filter(trabajador => trabajador.rol === rol);
    }

    // Aplicar ordenamiento si existe
    if (this.ordenColumna()) {
      resultado = this.ordenarTrabajadores(resultado);
    }

    this.trabajadoresFiltrados.set(resultado);
  }

  /**
   * Ordena los trabajadores según la columna y dirección seleccionada
   */
  private ordenarTrabajadores(trabajadores: InformacionCuentaDTO[]): InformacionCuentaDTO[] {
    const columna = this.ordenColumna();
    const direccion = this.ordenDireccion();

    return [...trabajadores].sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (columna) {
        case 'nombre':
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
          break;
        case 'cedula':
          valorA = a.cedula;
          valorB = b.cedula;
          break;
        case 'correo':
          valorA = a.correoElectronico.toLowerCase();
          valorB = b.correoElectronico.toLowerCase();
          break;
        case 'rol':
          valorA = a.rol;
          valorB = b.rol;
          break;
        case 'telefono':
          valorA = a.telefono;
          valorB = b.telefono;
          break;
        default:
          return 0;
      }

      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Maneja el cambio en el input de búsqueda
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.aplicarFiltros();
  }

  /**
   * Maneja el cambio en el filtro de rol
   */
  onRolFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.rolFiltro.set(select.value);
    this.aplicarFiltros();
  }

  /**
   * Cambia el ordenamiento de una columna
   * Alterna entre ascendente, descendente y sin ordenar
   */
  toggleOrden(columna: string): void {
    if (this.ordenColumna() === columna) {
      // Alterna la dirección
      if (this.ordenDireccion() === 'asc') {
        this.ordenDireccion.set('desc');
      } else {
        // Resetear ordenamiento
        this.ordenColumna.set('');
        this.ordenDireccion.set('asc');
      }
    } else {
      // Nueva columna
      this.ordenColumna.set(columna);
      this.ordenDireccion.set('asc');
    }

    this.aplicarFiltros();
  }

  /**
   * Obtiene el icono de ordenamiento para una columna
   */
  obtenerIconoOrden(columna: string): string {
    if (this.ordenColumna() !== columna) {
      return 'fa-sort';
    }
    return this.ordenDireccion() === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  /**
   * Navega a la página de creación de trabajador
   */
  crearTrabajador(): void {
    this.router.navigate(['/admin/dashboard/crear-trabajador']);
  }

  /**
   * Navega al detalle de un trabajador
   */
  verDetalle(idTrabajador: string): void {
    this.router.navigate(['/admin/trabajadores', idTrabajador]);
  }

  /**
   * Edita un trabajador
   */
  editarTrabajador(idTrabajador: string): void {
    this.router.navigate(['/admin/trabajadores/editar', idTrabajador]);
  }

  /**
   * Desactiva (elimina lógicamente) un trabajador
   * Confirmación previa con SweetAlert2
   */
  desactivarTrabajador(trabajador: InformacionCuentaDTO): void {
    Swal.fire({
      title: '¿Estás seguro?',
      html: `Vas a desactivar al trabajador:<br><strong>${trabajador.nombre}</strong><br>Esta acción se puede revertir.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarDesactivacion(trabajador.cedula);
      }
    });
  }

  /**
   * Ejecuta la desactivación del trabajador
   * Separación de responsabilidades: lógica de desactivación
   */
  private ejecutarDesactivacion(idTrabajador: string): void {
    this.adminService.desactivarTrabajador(idTrabajador).subscribe({
      next: (resp) => {
        if (!resp.error) {
          Swal.fire({
            title: '¡Desactivado!',
            text: 'El trabajador ha sido desactivado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.cargarTrabajadores();
        } else {
          Swal.fire({
            title: 'Error',
            text: resp.respuesta || 'No se pudo desactivar el trabajador',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (err) => {
        console.error('Error al desactivar trabajador:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  /**
   * Recarga la lista de trabajadores
   */
  recargarLista(): void {
    this.searchTerm.set('');
    this.rolFiltro.set('');
    this.ordenColumna.set('');
    this.ordenDireccion.set('asc');
    this.cargarTrabajadores();
  }

  /**
   * Obtiene el color del badge según el rol
   */
  obtenerColorRol(rol: string): string {
    const colores: { [key: string]: string } = {
      [Rol.ADMINISTRADOR]: 'rol-admin',
      [Rol.GESTOR_PRODUCTOS]: 'rol-gestor',
      [Rol.SUPERVISOR_PRODUCCION]: 'rol-supervisor',
      [Rol.ENCARGADO_ALMACEN]: 'rol-almacen'
    };
    return colores[rol] || 'rol-default';
  }

  /**
   * Formatea el rol para mostrarlo de manera amigable
   */
  formatearRol(rol: string): string {
    return rol.replace(/_/g, ' ');
  }

  /**
   * Verifica si hay trabajadores para mostrar
   */
  get hayTrabajadores(): boolean {
    return this.trabajadoresFiltrados().length > 0;
  }

  /**
   * Verifica si hay filtros activos
   */
  get hayFiltrosActivos(): boolean {
    return this.searchTerm().length > 0 || (this.rolFiltro().length > 0 && this.rolFiltro() !== 'TODOS');
  }
}
