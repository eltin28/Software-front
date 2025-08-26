import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { Footer } from "./componentes/footer/footer";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Software-front');
}
