import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
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

  ngOnInit(): void {
    // Configurar el callback para el logout por inactividad
    this.inactivityService.setLogoutCallback(() => {
      this.tokenService.logout();
    });

    // Iniciar el timer solo si el usuario está logueado
    if (this.tokenService.isLogged()) {
      this.inactivityService.startInactivityTimer();
    }
  }

  ngOnDestroy(): void {
    this.inactivityService.stopInactivityTimer();
  }
}
