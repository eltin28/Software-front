import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  imports: [],
  templateUrl: './pago-fallido.html',
  styleUrl: './pago-fallido.css'
})
export class PagoFallido {
  constructor(private router: Router) {}

  intentarDeNuevo(): void {
    this.router.navigateByUrl('/carrito');
  }
}
