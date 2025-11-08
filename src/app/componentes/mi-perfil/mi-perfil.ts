import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

import { InformacionCuentaDTO } from '../../dto/usuario/informacion-usuario-dto';
import { UsuarioService } from '../../servicios/usuario';
import { TokenService } from '../../servicios/token.service';
import { Rol } from '../../model/enums/Rol';

@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  // Signals para estado reactivo
  readonly perfil = signal<InformacionCuentaDTO | null>(null);
  readonly cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Computed para información derivada
  readonly iniciales = computed(() => {
    const perfilData = this.perfil();
    if (!perfilData?.nombre) return 'U';
    
    const palabras = perfilData.nombre.trim().split(' ');
    if (palabras.length >= 2) {
      return palabras[0][0].toUpperCase() + palabras[1][0].toUpperCase();
    }
    return palabras[0][0].toUpperCase();
  });

  readonly rolFormateado = computed(() => {
    const perfilData = this.perfil();
    if (!perfilData?.rol) return '';
    return this.formatearRol(perfilData.rol);
  });

  readonly tieneInfoCompleta = computed(() => {
    const perfilData = this.perfil();
    return !!(perfilData?.ciudadDeResidencia && perfilData?.direccion);
  });

  constructor(
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  /**
   * Carga la información del perfil del usuario autenticado
   * Manejo robusto de errores con estados de carga
   */
  private cargarPerfil(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.obtenerPerfil().subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          this.perfil.set(resp.respuesta);
        } else {
          this.error.set('No se pudo cargar la información del perfil');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.error.set('No se pudo conectar con el servidor. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  editarPerfil(): void {
    this.router.navigate(['/mi-perfil/editar-perfil']);
  }

  /**
   * Inicia el proceso de eliminación de cuenta
   * Implementa confirmación en dos pasos para prevenir eliminaciones accidentales
   */
  solicitarEliminarCuenta(): void {
    const perfilData = this.perfil();
    if (!perfilData) return;

    // Primera confirmación: Advertencia inicial
    Swal.fire({
      title: '⚠️ Eliminar Cuenta',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem; color: #374151; font-size: 0.938rem;">
            Estás a punto de eliminar tu cuenta permanentemente. Esta acción tendrá las siguientes consecuencias:
          </p>
          <ul style="color: #6b7280; font-size: 0.875rem; line-height: 1.8; margin-left: 1.5rem;">
            <li>Se perderá todo tu historial de pedidos</li>
            <li>Tu carrito de compras será eliminado</li>
            <li>No podrás recuperar tus datos personales</li>
            <li>Se cerrará tu sesión inmediatamente</li>
          </ul>
          <p style="margin-top: 1.5rem; color: #991b1b; font-weight: 600; font-size: 0.938rem;">
            ⚠️ Esta acción no se puede deshacer
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-wide'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarEliminarCuenta(perfilData.nombre);
      }
    });
  }

  /**
   * Segunda confirmación: Requiere escribir el nombre para confirmar
   * Patrón de seguridad tipo GitHub/GitLab para acciones destructivas
   */
  private confirmarEliminarCuenta(nombreUsuario: string): void {
    Swal.fire({
      title: 'Confirmación Final',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin-bottom: 1rem; color: #374151; font-size: 0.938rem;">
            Para confirmar la eliminación de tu cuenta, escribe tu nombre completo:
          </p>
          <p style="font-weight: 700; color: #111827; margin-bottom: 1rem; font-size: 1rem;">
            ${nombreUsuario}
          </p>
          <input 
            id="swal-input-confirm" 
            class="swal2-input" 
            placeholder="Escribe tu nombre aquí"
            style="font-size: 0.938rem;"
            autocomplete="off"
          >
        </div>
      `,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar mi cuenta',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const input = document.getElementById('swal-input-confirm') as HTMLInputElement;
        const valorIngresado = input?.value.trim();

        if (!valorIngresado) {
          Swal.showValidationMessage('Debes escribir tu nombre para continuar');
          return false;
        }

        if (valorIngresado !== nombreUsuario) {
          Swal.showValidationMessage('El nombre no coincide. Verifica e intenta nuevamente.');
          return false;
        }

        return true;
      },
      customClass: {
        popup: 'swal-wide'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarEliminacionCuenta();
      }
    });
  }

  /**
   * Ejecuta la eliminación de la cuenta
   * Cierra sesión automáticamente después de eliminar
   */
  private ejecutarEliminacionCuenta(): void {
    this.usuarioService.eliminarCuenta().subscribe({
      next: (resp) => {
        if (!resp.error) {
          Swal.fire({
            title: 'Cuenta Eliminada',
            text: 'Tu cuenta ha sido eliminada correctamente. Esperamos verte pronto.',
            icon: 'success',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false
          }).then(() => {
            // Cerrar sesión y redirigir al inicio
            this.tokenService.logout();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: resp.respuesta || 'No se pudo eliminar la cuenta',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  /**
   * Regresa a la vista anterior usando Location
   */
  regresar(): void {
    this.location.back();
  }

  /**
   * Recarga la información del perfil
   */
  recargarPerfil(): void {
    this.cargarPerfil();
  }

  /**
   * Formatea el rol para mostrarlo de manera amigable
   */
  public formatearRol(rol: string): string {
    const roles: { [key: string]: string } = {
      [Rol.CLIENTE]: 'Cliente',
      [Rol.ADMINISTRADOR]: 'Administrador',
      [Rol.GESTOR_PRODUCTOS]: 'Gestor de Productos',
      [Rol.SUPERVISOR_PRODUCCION]: 'Supervisor de Producción',
      [Rol.ENCARGADO_ALMACEN]: 'Encargado de Almacén'
    };
    return roles[rol] || rol.replace(/_/g, ' ');
  }

  /**
   * Obtiene el color del badge según el rol
   */
  obtenerColorRol(rol: string): string {
    const colores: { [key: string]: string } = {
      [Rol.CLIENTE]: 'badge-cliente',
      [Rol.ADMINISTRADOR]: 'badge-admin',
      [Rol.GESTOR_PRODUCTOS]: 'badge-gestor',
      [Rol.SUPERVISOR_PRODUCCION]: 'badge-supervisor',
      [Rol.ENCARGADO_ALMACEN]: 'badge-almacen'
    };
    return colores[rol] || 'badge-default';
  }

  /**
   * Obtiene el icono según el rol
   */
  obtenerIconoRol(rol: string): string {
    const iconos: { [key: string]: string } = {
      [Rol.CLIENTE]: 'fa-user',
      [Rol.ADMINISTRADOR]: 'fa-user-shield',
      [Rol.GESTOR_PRODUCTOS]: 'fa-boxes-stacked',
      [Rol.SUPERVISOR_PRODUCCION]: 'fa-industry',
      [Rol.ENCARGADO_ALMACEN]: 'fa-warehouse'
    };
    return iconos[rol] || 'fa-user';
  }

  /**
   * Copia un valor al portapapeles
   */
  copiarAlPortapapeles(valor: string, campo: string): void {
    navigator.clipboard.writeText(valor).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${campo} copiado`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }).catch(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo copiar',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }
}
