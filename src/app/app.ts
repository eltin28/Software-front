import { Component, signal, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { Footer } from "./componentes/footer/footer";
import { Accesibilidad } from './componentes/Accesibilidad/accesibilidad';
import { InactivityService } from './servicios/inactivity.service';
import { TokenService } from './servicios/token.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule, Footer, Accesibilidad],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Software-front');

  private readonly inactivityService = inject(InactivityService);
  private readonly tokenService = inject(TokenService);

  // Effect para escuchar cambios en el estado de autenticación
  private authEffect = effect(() => {
    const isLogged = this.tokenService.isLoggedSignal();
    if (isLogged) {
      this.inactivityService.startInactivityTimer();
    } else {
      this.inactivityService.stopInactivityTimer();
    }
  });

  ngOnInit(): void {
    // Configurar el callback para el logout por inactividad
    this.inactivityService.setLogoutCallback(() => {
      this.handleInactivityLogout();
    });

    // Iniciar el timer solo si el usuario está logueado
    if (this.tokenService.isLogged()) {
      this.inactivityService.startInactivityTimer();
    }
  }

  private handleInactivityLogout(): void {
    // Detener el timer primero
    this.inactivityService.stopInactivityTimer();
    // Luego hacer logout
    this.tokenService.logout();
    // Mostrar alerta
    alert('Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.');
  }

  ngOnDestroy(): void {
    this.inactivityService.stopInactivityTimer();
    // Destruir el effect
    this.authEffect.destroy();
  }
}