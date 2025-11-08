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
    this.step++;
    this.cdRef.detectChanges();
  }

  previousStep() {
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
    if (this.validatorFormEmail.invalid) {
      return;
    }

    this.emailUsuario = this.validatorFormEmail.get('email')?.value;

    const codigoContraseniaDTO: CodigoContraseniaDTO = {
      correoElectronico: this.emailUsuario
    };

    this.authService.enviarCodigoRecuperacion(codigoContraseniaDTO).subscribe({
      next: (data) => {

        Swal.fire({
          title: 'Email enviado',
          text: 'Por favor, revisa tu correo e ingresa el código enviado',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.nextStep();
          }
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'Error al enviar el código',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  public validarCodigo() {
    if (this.validatorFormCodigo.invalid) {
      return;
    }

    const codigoCompleto = this.codeArray.controls.map(control => control.value).join('');
    const validarCodigoDTO: ValidarCodigoDTO = {
      correoElectronico: this.emailUsuario,
      codigo: codigoCompleto
    };

    this.authService.validarCodigo(validarCodigoDTO).subscribe({
      next: (data) => {
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
    if (this.validatorFormContrase.invalid) {
      return;
    }

    const codigoCompleto = this.codeArray.controls.map(control => control.value).join('');
    const cambiarPasswordDTO: CambiarPasswordDTO = {
      codigoVerificacion: codigoCompleto,
      passwordNueva: this.validatorFormContrase.get('password')?.value || '',
    };

    this.authService.cambiarPassword(cambiarPasswordDTO).subscribe({
      next: (data) => {
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
