import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { Footer } from "./componentes/footer/footer";
import { Accesibilidad } from './componentes/Accesibilidad/accesibilidad';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule, Footer, Accesibilidad],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Software-front');
}
