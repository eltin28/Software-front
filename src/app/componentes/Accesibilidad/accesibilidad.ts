import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-accesibilidad',
  imports: [],
  templateUrl: './accesibilidad.html',
  styleUrl: './accesibilidad.css'
})
export class Accesibilidad {
  // Estado del panel (abierto/cerrado)
  panelOpen: WritableSignal<boolean> = signal(false);

  // Estado del contraste
  contrasteActivo: WritableSignal<boolean> = signal(false);

  // Tamaño de fuente base (en porcentaje)
  fontSize: WritableSignal<number> = signal(100);

  togglePanel(): void {
    this.panelOpen.update(open => !open);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  activarContraste(): void {
    this.contrasteActivo.update(activo => !activo);

    if (this.contrasteActivo()) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
  }

  aumentarFuente(): void {
    const nuevaFuente = this.fontSize() + 10;
    this.fontSize.set(nuevaFuente);
    document.documentElement.style.fontSize = `${nuevaFuente}%`;
  }

  disminuirFuente(): void {
    const nuevaFuente = Math.max(80, this.fontSize() - 10);
    this.fontSize.set(nuevaFuente);
    document.documentElement.style.fontSize = `${nuevaFuente}%`;
  }
}