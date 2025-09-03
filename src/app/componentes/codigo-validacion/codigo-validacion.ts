import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ValidarCodigoDTO } from '../../dto/usuario/validar-codigo-dto';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-codigo-validacion',
  imports: [ RouterModule, ReactiveFormsModule ],
  templateUrl: './codigo-validacion.html',
  styleUrl: './codigo-validacion.css'
})
export class CodigoValidacion {

  validatorForm!: FormGroup;
  emailGuardado: string;


  constructor(@Inject(DOCUMENT ) private document: Document, private formBuilder: FormBuilder, private authService: AuthService,
              private router: Router)
 {
    this.crearFormulario();
    this.emailGuardado = this.authService.getEmailTemp(); // Obtiene el correo almacenado
  }

    get codeArray() {
      return this.validatorForm.get('code') as FormArray;
    }
  

  private crearFormulario() {

    this.validatorForm = this.formBuilder.group(
      {
        code: this.formBuilder.array(
          Array(5).fill('').map(() => this.formBuilder.control('', [Validators.required]))
        )      
      },
    );
  }

    moverAlSiguiente(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    if (valor && index < this.codeArray.length - 1) {
      const siguienteInput = this.document.querySelectorAll<HTMLInputElement>('#inp-verifi')[index + 1];
      siguienteInput.focus();
    }
  }

  public validacionCodigo() {

    const codigoCompleto = this.codeArray.controls.map(control => control.value).join(''); // Une los valores de los controles en un solo string

    const validarCodigoDTO: ValidarCodigoDTO = { 
      correoElectronico: this.emailGuardado,
      codigo: codigoCompleto 
    };

    this.authService.validarCodigo(validarCodigoDTO).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta confirmada',
          text: 'La cuenta se ha confirmado correctamente, ahora puede iniciar sesión',
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
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });  
  }
}