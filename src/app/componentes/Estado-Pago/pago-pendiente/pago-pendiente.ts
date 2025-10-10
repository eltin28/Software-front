import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-pendiente',
  imports: [],
  templateUrl: './pago-pendiente.html',
  styleUrl: './pago-pendiente.css'
})
export class PagoPendiente {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigateByUrl('/');
  }
}
