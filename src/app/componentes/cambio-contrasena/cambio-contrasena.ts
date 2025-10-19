import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControlOptions } from '@angular/forms';
import { CambiarPasswordDTO } from '../../dto/usuario/cambiar-password-dto';
import { CodigoContraseniaDTO } from '../../dto/usuario/codigo-contrasenia-dto';
import { ValidarCodigoDTO } from '../../dto/usuario/validar-codigo-dto';
import { AuthService } from '../../servicios/auth.service';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambio-contrasena',
  imports: [ FontAwesomeModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './cambio-contrasena.html',
  styleUrl: './cambio-contrasena.css'
})
export class CambioContrasena {

  step = 1;
  showPassword = false;
  activeIcon = 'fa-eye';
  validatorFormEmail!: FormGroup;
  validatorFormCodigo!: FormGroup;
  validatorFormContrase!: FormGroup;
  emailUsuario: string = '';

  constructor(@Inject(DOCUMENT ) private document: Document, private formBuilder: FormBuilder,
              private authService: AuthService, private router: Router ,private cdRef: ChangeDetectorRef )
  {
    this.crearFormulario();
  }

  nextStep() {
    console.log(' nextStep() llamado - Step actual:', this.step);
    this.step++;
    console.log(' Nuevo step:', this.step);
    this.cdRef.detectChanges(); // Forzar detección de cambios
    console.log('ChangeDetection forzado');
  }

  previousStep() {
    console.log(' previousStep() llamado - Step actual:', this.step);
    if (this.step > 1) this.step--;
  }

  get codeArray() {
    return this.validatorFormCodigo.get('code') as FormArray;
  }

  private crearFormulario() {
    this.validatorFormEmail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.validatorFormCodigo = this.formBuilder.group({
      code: this.formBuilder.array(
        Array(5).fill('').map(() => this.formBuilder.control('', [Validators.required]))
      )
    });

    this.validatorFormContrase = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(7)]],
        confirmaPassword: ['', [Validators.required]]
      },
      {
        validators: [this.passwordsMatchValidator]
      } as AbstractControlOptions
    );
  }

  public EmailContra() {
    console.log('📧 EmailContra() iniciado');

    if (this.validatorFormEmail.invalid) {
      console.log(' Formulario email inválido');
      return;
    }

    this.emailUsuario = this.validatorFormEmail.get('email')?.value;
    console.log(' Email a procesar:', this.emailUsuario);

    const codigoContraseniaDTO: CodigoContraseniaDTO = {
      correoElectronico: this.emailUsuario
    };

    console.log(' Enviando petición al servidor...');

    this.authService.enviarCodigoRecuperacion(codigoContraseniaDTO).subscribe({
      next: (data) => {
        console.log(' RESPUESTA EXITOSA DEL SERVIDOR:', data);

        Swal.fire({
          title: 'Email enviado',
          text: 'Por favor, revisa tu correo e ingresa el código enviado',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          console.log(' Resultado de SweetAlert:', result);
          if (result.isConfirmed) {
            console.log('➡ Usuario hizo clic en Aceptar - Avanzando al paso 2');
            this.nextStep();
          } else {
            console.log(' Usuario NO hizo clic en Aceptar');
          }
        });
      },
      error: (error) => {
        console.log(' ERROR EN LA PETICIÓN:', error);
        console.log(' Status:', error.status);
        console.log(' Mensaje:', error.message);
        console.log(' Respuesta:', error.error);

        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'Error al enviar el código',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Nuevo método para validar el código
  public validarCodigo() {
    console.log(' validarCodigo() iniciado');

    if (this.validatorFormCodigo.invalid) {
      console.log(' Formulario código inválido');
      return;
    }

    const codigoCompleto = this.codeArray.controls.map(control => control.value).join('');
    console.log(' Código ingresado:', codigoCompleto);

    const validarCodigoDTO: ValidarCodigoDTO = {
      correoElectronico: this.emailUsuario,
      codigo: codigoCompleto
    };

    this.authService.validarCodigo(validarCodigoDTO).subscribe({
      next: (data) => {
        console.log(' Código validado exitosamente');
        Swal.fire({
          title: 'Código válido',
          text: 'El código ha sido verificado correctamente',
          icon: 'success',
          confirmButtonText: 'Continuar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.nextStep();
          }
        });
      },
      error: (error) => {
        console.log(' Error validando código:', error);
        Swal.fire({
          title: 'Error',
          text: 'El código ingresado no es válido o ha expirado',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  public CodigoContra() {
    console.log(' CodigoContra() iniciado');

    if (this.validatorFormContrase.invalid) {
      console.log(' Formulario contraseña inválido');
      return;
    }

    const codigoCompleto = this.codeArray.controls.map(control => control.value).join('');
    const cambiarPasswordDTO: CambiarPasswordDTO = {
      codigoVerificacion: codigoCompleto,
      passwordNueva: this.validatorFormContrase.get('password')?.value || '',
    };

    console.log(' Cambiando contraseña con código:', cambiarPasswordDTO.codigoVerificacion);

    this.authService.cambiarPassword(cambiarPasswordDTO).subscribe({
      next: (data) => {
        console.log(' Contraseña cambiada exitosamente');
        Swal.fire({
          title: 'Contraseña modificada',
          text: 'La contraseña ha sido modificada correctamente, ahora puede iniciar sesión',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["/login"]);
          }
        });
      },
      error: (error) => {
        console.log(' Error cambiando contraseña:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al cambiar la contraseña. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword =!this.showPassword;
    this.activeIcon = this.activeIcon === 'fa-eye'? 'fa-eye-slash' : 'fa-eye';
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;

    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }
}
