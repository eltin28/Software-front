import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { MostrarPedidoDTO } from '../../dto/pedido/mostrar-pedido-dto';
import { PagoDTO } from '../../dto/pedido/pago-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-pedido',
    imports: [ CurrencyPipe, RouterModule ],
  templateUrl: './detalle-pedido.html',
  styleUrls: ['./detalle-pedido.css'],
})
export class DetallePedido {
  pedido = signal<MostrarPedidoDTO | null>(null);
  pago = signal<PagoDTO | null>(null);

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idPedido = this.route.snapshot.paramMap.get('idPedido')!;
    this.usuarioService.verDetallePedido(idPedido).subscribe({
      next: (resp: MensajeDTO<MostrarPedidoDTO>) => this.pedido.set(resp.respuesta),
    });
  }

irAPagar(): void {
  const pedidoActual = this.pedido();
  if (!pedidoActual) return;

  this.usuarioService.iniciarPago(pedidoActual.idPedido).subscribe({
    next: (resp) => {
      window.location.href = resp.respuesta.init_point;
    }
  });
  }
}
