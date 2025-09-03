import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';
import { CrearCuentaDTO } from '../../dto/usuario/crear-usuario-dto';
import { LoginDTO } from '../../dto/usuario/login-dto';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ ReactiveFormsModule , FontAwesomeModule, RouterModule ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroLoginComponent implements OnInit {

  container: HTMLElement | null = null;
  showPassword = false;
  activeIcon = 'fa-eye';
  registroForm!: FormGroup;
  loginForm!: FormGroup;


  constructor(@Inject(DOCUMENT ) private document: Document, private formBuilder: FormBuilder,
    private authService: AuthService, private tokenService: TokenService, private router: Router
  ) {

    this.crearFormulario();
  }

  private crearFormulario() {

    this.registroForm = this.formBuilder.group(
      {
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      contrasenia: ['', [Validators.required, Validators.minLength(7)]],
      confirmaContrasenia: ['', [Validators.required]]
      },
      { 
        validators: [this.passwordsMatchValidator]
      } as AbstractControlOptions
    );

    this.loginForm = this.formBuilder.group(
      {
        correoElectronico: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      }
    );

   }

  public registrar() {
    const crearCuenta = this.registroForm.value as CrearCuentaDTO;
    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        const correoElectronico = this.registroForm.get('correoElectronico')?.value;
        this.authService.setEmailTemp(correoElectronico);
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
           this.router.navigate(["/codigo-validacion"]);
          }
        })
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });   
  }

  public login() {
    const loginDTO = this.loginForm.value as LoginDTO;

    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta
        });
      },
    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const contrasenia = formGroup.get('contrasenia')?.value ?? '';
    const confirmaContrasenia = formGroup.get('confirmaContrasenia')?.value ?? '';
   
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return contrasenia == confirmaContrasenia ? null : { passwordsMismatch: true };
  }   

  /** Configuración de eventos para el cambio de panel */
  ngOnInit(): void {
    this.container = this.document.getElementById('auth-container') || this.document.getElementById('container');

    const signUpButton = this.document.getElementById('signUp');
    const signInButton = this.document.getElementById('signIn');

    signUpButton?.addEventListener('click', () => this.togglePanel('right'));
    signInButton?.addEventListener('click', () => this.togglePanel('left'));
  }

  togglePanel(direction: 'left' | 'right'): void {
    if (!this.container) return;
    this.container.classList.toggle('right-panel-active');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.activeIcon = this.activeIcon === 'fa-eye' ? 'fa-eye-slash' : 'fa-eye';
  }
}