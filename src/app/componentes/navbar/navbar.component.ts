import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { UsuarioService } from '../../servicios/usuario';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CarritoResponseDTO } from '../../dto/carrito/carrito-response-dto';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

  public readonly cartItemCount = signal<number>(0);
  public readonly showUserMenu = signal<boolean>(false);
  public readonly showMobileMenu = signal<boolean>(false);

  title = 'E-Shop';

  private readonly router = inject(Router);

  constructor(private tokenService: TokenService,
              private usuarioService: UsuarioService
  ) {}

    ngOnInit(): void {
    if (this.isLoggedIn) {
      this.cargarCantidadCarrito();
    }
  }

  private cargarCantidadCarrito(): void {
    const idUsuario = this.tokenService.getAllTokenData().id;

    this.usuarioService.obtenerCarritoCompleto(idUsuario).subscribe({
      next: (respuesta: MensajeDTO<CarritoResponseDTO>) => {
        this.cartItemCount.set(respuesta.respuesta.totalProductos ?? 0);
      },
      error: (err) => {
        console.error('Error cargando cantidad del carrito:', err);
        this.cartItemCount.set(0);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }

  get userName(): string {
    return this.isLoggedIn ? this.tokenService.getAllTokenData().nombre : '';
  }

  toggleUserMenu(): void {
    this.showUserMenu.set(!this.showUserMenu());
    if (this.showMobileMenu()) this.showMobileMenu.set(false);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.set(!this.showMobileMenu());
    if (this.showUserMenu()) this.showUserMenu.set(false);
  }

  closeAllMenus(): void {
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
  }

  logout(): void {
    this.tokenService.logout();
    this.closeAllMenus();
  }

  navigateToCart(): void {
    this.closeAllMenus();
    this.router.navigate(['/carrito']);
  }

  navigateToLogin(): void {
    this.closeAllMenus();
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.closeAllMenus();
    this.router.navigate(['/profile']);
  }
}
