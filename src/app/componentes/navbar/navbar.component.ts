// navbar.component.ts — Angular 18, standalone, todo quemado
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  // Signals (estado interno)
  private readonly _isLoggedIn = signal<boolean>(false);
  private readonly _userEmail = signal<string>('');
  private readonly _cartItemCount = signal<number>(0);
  private readonly _showUserMenu = signal<boolean>(false);
  private readonly _showMobileMenu = signal<boolean>(false);

  // Exponer como readonly
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();
  readonly cartItemCount = this._cartItemCount.asReadonly();
  readonly showUserMenu = this._showUserMenu.asReadonly();
  readonly showMobileMenu = this._showMobileMenu.asReadonly();

  // Propiedades fijas (quemadas)
  readonly title = 'E-Shop';

  // Router con inject() (Angular 16+; recomendado en 18)
  private readonly router = inject(Router);

  constructor() {
    // Estado inicial completamente quemado
    this._isLoggedIn.set(true);              // estás logueado “por defecto”
    this._userEmail.set('usuario@demo.com'); // correo fijo
    this._cartItemCount.set(3);              // ítems fijos en el carrito
  }

  // Toggle del menú de usuario
  toggleUserMenu(): void {
    this._showUserMenu.set(!this._showUserMenu());
    if (this._showMobileMenu()) this._showMobileMenu.set(false);
  }

  // Toggle del menú móvil
  toggleMobileMenu(): void {
    this._showMobileMenu.set(!this._showMobileMenu());
    if (this._showUserMenu()) this._showUserMenu.set(false);
  }

  // Cerrar todos los menús
  closeAllMenus(): void {
    this._showUserMenu.set(false);
    this._showMobileMenu.set(false);
  }

  // Logout (quemado)
  logout(): void {
    this._isLoggedIn.set(false);
    this._userEmail.set('');
    this.closeAllMenus();
    this.router.navigate(['/']);
  }

  // Navegación al carrito
  navigateToCart(): void {
    this.closeAllMenus();
    this.router.navigate(['/carrito']);
  }

  // Navegación al login
  navigateToLogin(): void {
    this.closeAllMenus();
    this.router.navigate(['/login']);
  }

  // Navegación a perfil
  navigateToProfile(): void {
    this.closeAllMenus();
    this.router.navigate(['/profile']);
  }
}
