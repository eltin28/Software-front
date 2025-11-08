import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

import { EditarCuentaDTO } from '../../dto/usuario/editar-usuario-dto';
import { InformacionCuentaDTO } from '../../dto/usuario/informacion-usuario-dto';
import { UsuarioService } from '../../servicios/usuario';

@Component({
  selector: 'app-editar-perfil',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css'
})
export class EditarPerfil implements OnInit {

  // Signals para estado reactivo
  readonly editarForm = signal<FormGroup | null>(null);
  readonly perfilOriginal = signal<InformacionCuentaDTO | null>(null);
  readonly cargando = signal<boolean>(true);
  readonly guardando = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);

  // Computed para detectar cambios en el formulario
  readonly hayPendientes = computed(() => {
    const form = this.editarForm();
    return form ? form.dirty : false;
  });

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cargarPerfilYCrearFormulario();
  }

  /**
   * Carga el perfil del usuario y crea el formulario con los datos actuales
   * Separación de responsabilidades: carga de datos vs inicialización
   */
  private cargarPerfilYCrearFormulario(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.obtenerPerfil().subscribe({
      next: (resp) => {
        if (!resp.error && resp.respuesta) {
          this.perfilOriginal.set(resp.respuesta);
          this.inicializarFormulario(resp.respuesta);
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

  /**
   * Inicializa el formulario reactivo con los datos actuales del usuario
   * Validadores alineados con las restricciones del backend
   */
  private inicializarFormulario(perfil: InformacionCuentaDTO): void {
    const form = this.formBuilder.group({
      nombre: [perfil.nombre, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50)
      ]],
      telefono: [perfil.telefono, [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ]],
      ciudadDeResidencia: [perfil.ciudadDeResidencia || '', [
        Validators.maxLength(100)
      ]],
      direccion: [perfil.direccion || '', [
        Validators.maxLength(150)
      ]],
      contrasenia: ['', [
        Validators.minLength(7),
        Validators.maxLength(20)
      ]]
    });

    this.editarForm.set(form);
  }

  /**
   * Guarda los cambios del perfil
   * Solo envía los campos que han sido modificados
   */
  guardarCambios(): void {
    this.submitted.set(true);
    this.error.set(null);

    const form = this.editarForm();
    if (!form || form.invalid) {
      this.error.set('Por favor, completa todos los campos correctamente.');
      this.scrollToTop();
      return;
    }

    // Confirmar si hay contraseña para cambiar
    const contraseña = form.get('contrasenia')?.value?.trim();
    if (contraseña) {
      this.confirmarCambioContraseña();
    } else {
      this.ejecutarGuardado();
    }
  }

  /**
   * Confirma si el usuario realmente quiere cambiar la contraseña
   * Prevención de cambios accidentales
   */
  private confirmarCambioContraseña(): void {
    Swal.fire({
      title: '¿Cambiar contraseña?',
      text: 'Has ingresado una nueva contraseña. ¿Deseas cambiarla?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, mantener actual'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarGuardado();
      } else {
        // Limpiar campo de contraseña y guardar sin ella
        this.editarForm()?.get('contrasenia')?.setValue('');
        this.ejecutarGuardado();
      }
    });
  }

  /**
   * Ejecuta el guardado de los cambios
   * Construye el DTO solo con campos modificados
   */
  private ejecutarGuardado(): void {
    const form = this.editarForm();
    if (!form) return;

    this.guardando.set(true);

    const editarDTO: EditarCuentaDTO = this.construirDTO(form);

    this.usuarioService.editarPerfil(editarDTO).subscribe({
      next: (resp) => {
        if (!resp.error) {
          Swal.fire({
            title: '¡Perfil actualizado!',
            text: 'Tus cambios han sido guardados correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/perfil']);
          });
        } else {
          this.error.set(resp.respuesta || 'Error al actualizar el perfil');
          this.scrollToTop();
        }
        this.guardando.set(false);
      },
      error: (err) => {
        console.error('Error al guardar perfil:', err);
        const mensajeError = err.error?.respuesta || 'No se pudo conectar con el servidor';
        this.error.set(mensajeError);
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.guardando.set(false);
        this.scrollToTop();
      }
    });
  }

  /**
   * Construye el DTO solo con los campos que tienen valor
   * Optimización: solo envía datos necesarios al backend
   */
  private construirDTO(form: FormGroup): EditarCuentaDTO {
    const dto: EditarCuentaDTO = {};

    const nombre = form.get('nombre')?.value?.trim();
    if (nombre) dto.nombre = nombre;

    const telefono = form.get('telefono')?.value?.trim();
    if (telefono) dto.telefono = telefono;

    const ciudad = form.get('ciudadDeResidencia')?.value?.trim();
    if (ciudad) dto.ciudadDeResidencia = ciudad;

    const direccion = form.get('direccion')?.value?.trim();
    if (direccion) dto.direccion = direccion;

    const contrasenia = form.get('contrasenia')?.value?.trim();
    if (contrasenia) dto.contrasenia = contrasenia;

    return dto;
  }

  /**
   * Cancela la edición y pregunta si hay cambios sin guardar
   */
  cancelar(): void {
    if (this.hayPendientes()) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Continuar editando'
      }).then((result) => {
        if (result.isConfirmed) {
          this.volverAlPerfil();
        }
      });
    } else {
      this.volverAlPerfil();
    }
  }

  /**
   * Navega de vuelta al perfil
   */
  private volverAlPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Restaura los valores originales del formulario
   */
  restaurarValores(): void {
    const perfil = this.perfilOriginal();
    const form = this.editarForm();
    
    if (!perfil || !form) return;

    Swal.fire({
      title: '¿Restaurar valores?',
      text: 'Se perderán todos los cambios realizados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6b7280',
      cancelButtonColor: '#4f46e5',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        form.patchValue({
          nombre: perfil.nombre,
          telefono: perfil.telefono,
          ciudadDeResidencia: perfil.ciudadDeResidencia || '',
          direccion: perfil.direccion || '',
          contrasenia: ''
        });
        form.markAsPristine();
        this.submitted.set(false);
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Valores restaurados',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Obtiene los errores de un control específico
   */
  obtenerErroresControl(nombreControl: string): string[] {
    const form = this.editarForm();
    if (!form) return [];

    const control = form.get(nombreControl);
    if (!control || !control.errors || (!control.dirty && !this.submitted())) {
      return [];
    }

    return this.construirMensajesError(nombreControl, control.errors);
  }

  /**
   * Construye mensajes de error descriptivos
   */
  private construirMensajesError(nombreControl: string, errores: { [key: string]: any }): string[] {
    const mensajes: string[] = [];

    if (errores['required']) {
      mensajes.push(`${this.obtenerNombreAmigable(nombreControl)} es requerido`);
    }
    if (errores['minlength']) {
      mensajes.push(`Mínimo ${errores['minlength'].requiredLength} caracteres`);
    }
    if (errores['maxlength']) {
      mensajes.push(`Máximo ${errores['maxlength'].requiredLength} caracteres`);
    }
    if (errores['pattern']) {
      if (nombreControl === 'telefono') {
        mensajes.push('El teléfono debe contener exactamente 10 dígitos');
      } else {
        mensajes.push('Formato inválido');
      }
    }

    return mensajes;
  }

  /**
   * Obtiene el nombre amigable de un control
   */
  private obtenerNombreAmigable(nombreControl: string): string {
    const nombres: { [key: string]: string } = {
      nombre: 'El nombre',
      telefono: 'El teléfono',
      ciudadDeResidencia: 'La ciudad',
      direccion: 'La dirección',
      contrasenia: 'La contraseña'
    };
    return nombres[nombreControl] || nombreControl;
  }

  /**
   * Verifica si un control tiene errores
   */
  tieneError(nombreControl: string): boolean {
    const form = this.editarForm();
    if (!form) return false;
    const control = form.get(nombreControl);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted()));
  }

  /**
   * Scroll hacia arriba (útil al mostrar errores)
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Recarga el perfil original
   */
  recargar(): void {
    this.cargarPerfilYCrearFormulario();
  }

  // Getters para facilitar acceso en el template
  get fControls() {
    return this.editarForm()?.controls;
  }

  get formularioInvalido(): boolean {
    const form = this.editarForm();
    return !form || (form.invalid && this.submitted());
  }
}
