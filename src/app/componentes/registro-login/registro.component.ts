// registro.component.ts — Angular 20, standalone
import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Interfaces mínimas para tipar
interface CrearCuentaDTO {
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmaPassword: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroLoginComponent implements OnInit {

  private readonly document = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  container: HTMLElement | null = null;
  showPassword = false;
  activeIcon = 'fa-eye';

  registroForm!: FormGroup;
  loginForm!: FormGroup;

  constructor() {
    this.crearFormularios();
  }

  /** Inicializa los formularios */
  private crearFormularios(): void {
    this.registroForm = this.fb.group(
      {
        cedula: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{7,10}$/)]],
        password: ['', [Validators.required, Validators.minLength(7)]],
        confirmaPassword: ['', [Validators.required]]
      },
      { validators: [this.passwordsMatchValidator] } as AbstractControlOptions
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /** Registro de usuario */
  registrar(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const crearCuenta = this.registroForm.value as CrearCuentaDTO;

    // TODO: Reemplazar por llamada real a AuthService
    console.log('Datos de registro:', crearCuenta);
    alert('Cuenta registrada (modo prueba). Redirigiendo...');
    this.router.navigate(['/codigo-validacion']).catch(console.error);
  }

  /** Inicio de sesión */
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const dto = this.loginForm.value as LoginDTO;

    // TODO: Reemplazar por llamada real a AuthService
    console.log('Datos de login:', dto);
    alert('Inicio de sesión exitoso (modo prueba)');
    this.router.navigate(['/']).catch(console.error);
  }

  /** Validador personalizado para comparar contraseñas */
  private passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value ?? '';
    const confirmaPassword = formGroup.get('confirmaPassword')?.value ?? '';
    return password === confirmaPassword ? null : { passwordsMismatch: true };
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
