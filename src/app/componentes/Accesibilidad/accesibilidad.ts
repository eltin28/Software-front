import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Accesibilidad',
  standalone: true, // ✅ lo ponemos standalone para evitar problemas
  imports: [CommonModule],
  templateUrl: './componentes/accesibilidad.component.html',
  styleUrls: ['./Accesibilidad.component.css']
})
export class AccesibilidadComponent implements OnInit {
  panelOpen = false;
  fontSize = 100; // tamaño de fuente %
  contrasteActivo = false;

  constructor() {}

  ngOnInit(): void {
    // Recuperar valores guardados en localStorage
    const fuenteGuardada = localStorage.getItem('fontSize');
    const contrasteGuardado = localStorage.getItem('contrasteActivo');

    if (fuenteGuardada) {
      this.fontSize = parseInt(fuenteGuardada, 10);
      this.aplicarFuente();
    }

    if (contrasteGuardado === 'true') {
      this.contrasteActivo = true;
      document.body.classList.add('contraste-oscuro');
    }
  }

  // ====== Panel ======
  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }

  closePanel(): void {
    this.panelOpen = false;
  }

  // cerrar con tecla ESC
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.panelOpen) {
      this.closePanel();
    }
  }

  // ====== Accesibilidad ======

  // Fuente
  aplicarFuente(): void {
    document.body.style.fontSize = this.fontSize + '%';
    localStorage.setItem('fontSize', this.fontSize.toString());
  }

  aumentarFuente(): void {
    if (this.fontSize < 200) {
      this.fontSize += 10;
      this.aplicarFuente();
    }
  }

  disminuirFuente(): void {
    if (this.fontSize > 80) {
      this.fontSize -= 10;
      this.aplicarFuente();
    }
  }

  // Contraste
  activarContraste(): void {
    this.contrasteActivo = !this.contrasteActivo;
    if (this.contrasteActivo) {
      document.body.classList.add('contraste-oscuro');
      localStorage.setItem('contrasteActivo', 'true');
    } else {
      document.body.classList.remove('contraste-oscuro');
      localStorage.setItem('contrasteActivo', 'false');
    }
  }
}
