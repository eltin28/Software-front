import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  imports: [],
  templateUrl: './pago-exitoso.html',
  styleUrl: './pago-exitoso.css'
})
export class PagoExitoso {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigateByUrl('/');
  }
}