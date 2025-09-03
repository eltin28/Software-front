import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControlOptions } from '@angular/forms';
import { CambiarPasswordDTO } from '../../dto/usuario/cambiar-password-dto';
import { CodigoContraseniaDTO } from '../../dto/usuario/codigo-contrasenia-dto';
import { AuthService } from '../../servicios/auth.service';
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
  validatorFormContrase!: FormGroup;

  constructor(@Inject(DOCUMENT ) private document: Document, private formBuilder: FormBuilder, 
              private authService: AuthService, private router: Router )
  {
    this.crearFormulario();
  }

  nextStep() {
    this.step++;
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  get codeArray() {
    return this.validatorFormContrase.get('code') as FormArray;
  }

  private crearFormulario() {

    this.validatorFormEmail = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],     
      },
    );
    this.validatorFormContrase = this.formBuilder.group(
      {
        code: this.formBuilder.array(
          Array(5).fill('').map(() => this.formBuilder.control('', [Validators.required]))
        ),
        password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
        confirmaPassword: ['', [Validators.required]]
      },
      { 
        validators: [this.passwordsMatchValidator]
      } as AbstractControlOptions
    );
  }

  public EmailContra() {
    const codigoContraseniaDTO = this.validatorFormEmail.value as CodigoContraseniaDTO;

    this.authService.enviarCodigoRecuperacion(codigoContraseniaDTO).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Email enviado',
          text: 'Por favor, revisa tu correo e ingresa el codigo enviado',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.nextStep();
          }
        })
      },
      error: (error) => {
        console.log(error),
        Swal.fire({
          title: 'Error',
          text: 'Por favor, revisa el correo ingresado',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });
  }

  public CodigoContra() {
    
    const codigoCompleto = this.codeArray.controls.map(control => control.value).join(''); 

    const cambiarPasswordDTO: CambiarPasswordDTO = { 
      codigoVerificacion: codigoCompleto,
      passwordNueva: this.validatorFormContrase.get('password')?.value || '',
    };

    console.log(cambiarPasswordDTO.codigoVerificacion, "codigo");

    this.authService.cambiarPassword(cambiarPasswordDTO).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Contraseña modificada',
          text: 'La contraseña ha sido modificada correctamente, ahora puede iniciar sesión',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
           this.router.navigate(["/login"]);
          }
        })
      },
      error: (error) => {
        console.log(error),
        Swal.fire({
          title: 'Error',
          text: 'Por favor, revisa el codigo ingresado',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isDenied) {
            this.previousStep();
          }
        })
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword =!this.showPassword;
    this.activeIcon = this.activeIcon === 'fa-eye'? 'fa-eye-slash' : 'fa-eye'; // Cambia el icono activo
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
   
   
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password == confirmaPassword ? null : { passwordsMismatch: true };
  }   
}