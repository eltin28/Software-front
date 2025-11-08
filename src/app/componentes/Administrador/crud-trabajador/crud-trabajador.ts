import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { CrearTrabajadorDTO } from '../../../dto/usuario/crear-trabajador-dto';
import { AdminService } from '../../../servicios/admin';
import { Rol } from '../../../model/enums/Rol';
import { cedulaValidator, passwordStrengthValidator } from '../../../validators/custom-validators';

@Component({
  selector: 'app-crear-trabajador',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './crud-trabajador.html',
  styleUrl: './crud-trabajador.css'
})
export class CrudTrabajador implements OnInit {

  // Signals para estado del componente
  readonly crearForm = signal<FormGroup | null>(null);
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  // Roles disponibles para crear trabajadores (excluyendo CLIENTE)
  readonly rolesDisponibles = signal<Rol[]>([
    Rol.ADMINISTRADOR,
    Rol.GESTOR_PRODUCTOS,
    Rol.SUPERVISOR_PRODUCCION,
    Rol.ENCARGADO_ALMACEN
  ]);

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    // El formulario se inicializa en el constructor
  }

  /**
   * Inicializa el formulario reactivo con validadores
   * Separación de responsabilidades: inicialización del form
   */
  private inicializarFormulario(): void {
    const form = this.formBuilder.group(
      {
        cedula: ['', [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(11),
          cedulaValidator() // Custom validator
        ]],
        nombre: ['', [
          Validators.required,
          Validators.maxLength(100)
        ]],
        telefono: ['', [
          Validators.required,
          Validators.pattern(/^\d{10}$/)
        ]],
        correoElectronico: ['', [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]],
        contrasenia: ['', [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(20),
          passwordStrengthValidator() // Custom validator
        ]],
        confirmaContrasenia: ['', [Validators.required]],
        rol: ['', [Validators.required]],
        ciudadDeResidencia: ['', [Validators.maxLength(100)]],
        direccion: ['', [Validators.maxLength(200)]]
      },
      {
        validators: [this.passwordsMatchValidator]
      } as AbstractControlOptions
    );

    this.crearForm.set(form);
  }

  /**
   * Validador personalizado: verifica que las contraseñas coincidan
   * Validación a nivel de formulario
   */
  private passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const contrasenia = formGroup.get('contrasenia')?.value ?? '';
    const confirmaContrasenia = formGroup.get('confirmaContrasenia')?.value ?? '';

    if (contrasenia && confirmaContrasenia && contrasenia !== confirmaContrasenia) {
      formGroup.get('confirmaContrasenia')?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    }

    const confirmaControl = formGroup.get('confirmaContrasenia');
    if (confirmaControl?.hasError('passwordsMismatch')) {
      confirmaControl.setErrors(null);
    }

    return null;
  }

  /**
   * Crea un nuevo trabajador en el sistema
   * Validación previa del formulario y manejo de errores
   */
  crearTrabajador(): void {
    this.submitted.set(true);
    this.error.set(null);

    const form = this.crearForm();
    if (!form || form.invalid) {
      this.error.set('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.cargando.set(true);

    const trabajadorDTO: CrearTrabajadorDTO = {
      cedula: form.get('cedula')?.value?.trim(),
      nombre: form.get('nombre')?.value?.trim(),
      telefono: form.get('telefono')?.value?.trim(),
      correoElectronico: form.get('correoElectronico')?.value?.trim().toLowerCase(),
      contrasenia: form.get('contrasenia')?.value,
      rol: form.get('rol')?.value,
      ciudadDeResidencia: form.get('ciudadDeResidencia')?.value?.trim() || undefined,
      direccion: form.get('direccion')?.value?.trim() || undefined
    };

    this.adminService.crearTrabajador(trabajadorDTO).subscribe({
      next: (resp) => {
        if (!resp.error) {
          Swal.fire({
            title: '¡Trabajador creado!',
            text: 'El trabajador se ha registrado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/admin/trabajadores']);
            }
          });
        } else {
          this.error.set(resp.respuesta || 'Error al crear el trabajador');
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al crear trabajador:', err);
        const mensajeError = err.error?.respuesta || 'No se pudo conectar con el servidor';
        this.error.set(mensajeError);
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Reintentar'
        });
        this.cargando.set(false);
      }
    });
  }

  /**
   * Obtiene los errores del formulario para mostrar en el template
   */
  obtenerErroresControl(nombreControl: string): string[] {
    const form = this.crearForm();
    if (!form) return [];

    const control = form.get(nombreControl);
    if (!control || !control.errors || !this.submitted()) {
      return [];
    }

    return this.construirMensajesError(nombreControl, control.errors);
  }

  /**
   * Construye mensajes de error descriptivos según el tipo de validación
   * Lógica centralizada para mensajes de error
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
      mensajes.push(this.obtenerMensajePattern(nombreControl));
    }
    if (errores['email']) {
      mensajes.push('Email inválido');
    }
    if (errores['passwordsMismatch']) {
      mensajes.push('Las contraseñas no coinciden');
    }
    if (errores['weakPassword']) {
      mensajes.push('Contraseña debe tener mayúscula, número y minúscula');
    }
    if (errores['invalidCedula']) {
      mensajes.push('Cédula inválida');
    }

    return mensajes;
  }

  /**
   * Obtiene el nombre amigable del control para mostrar en errores
   */
  private obtenerNombreAmigable(nombreControl: string): string {
    const nombres: { [key: string]: string } = {
      cedula: 'La cédula',
      nombre: 'El nombre',
      telefono: 'El teléfono',
      correoElectronico: 'El email',
      contrasenia: 'La contraseña',
      confirmaContrasenia: 'La confirmación de contraseña',
      rol: 'El rol',
      ciudadDeResidencia: 'La ciudad',
      direccion: 'La dirección'
    };
    return nombres[nombreControl] || nombreControl;
  }

  /**
   * Obtiene el mensaje específico para validaciones de pattern
   */
  private obtenerMensajePattern(nombreControl: string): string {
    const mensajes: { [key: string]: string } = {
      cedula: 'La cédula solo debe contener números',
      telefono: 'El teléfono debe contener exactamente 10 dígitos'
    };
    return mensajes[nombreControl] || 'Formato inválido';
  }

  /**
   * Verifica si un control tiene errores y fue tocado
   */
  tieneError(nombreControl: string): boolean {
    const form = this.crearForm();
    if (!form) return false;
    const control = form.get(nombreControl);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted()));
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Alterna la visibilidad de la confirmación de contraseña
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  /**
   * Cancela la creación y navega de vuelta
   */
  cancelar(): void {
    this.router.navigate(['/admin/trabajadores']);
  }

  // Getters para acceso fácil en el template
  get fControls() {
    return this.crearForm()?.controls;
  }

  get formularioInvalido(): boolean {
    const form = this.crearForm();
    return !form || (form.invalid && this.submitted());
  }
}

