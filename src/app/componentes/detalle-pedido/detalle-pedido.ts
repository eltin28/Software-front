import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario';
import { MostrarPedidoDTO } from '../../dto/pedido/mostrar-pedido-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-pedido',
  imports: [ CurrencyPipe, RouterModule, DatePipe ],
  templateUrl: './detalle-pedido.html',
  styleUrls: ['./detalle-pedido.css'],
})
export class DetallePedido {

  // Estado reactivo con signals
  pedido = signal<MostrarPedidoDTO | null>(null);
  preference = signal<any | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idPedido = params.get('idPedido');
      if (idPedido) {
        this.usuarioService.verDetallePedido(idPedido).subscribe({
          next: (resp: MensajeDTO<MostrarPedidoDTO>) => this.pedido.set(resp.respuesta),
        });
      }
    });
  }

  private cargarPedido(idPedido: string): void {
    this.cargando.set(true);
    this.usuarioService.verDetallePedido(idPedido).subscribe({
      next: (resp: MensajeDTO<MostrarPedidoDTO>) => {
        this.pedido.set(resp.respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el pedido.');
        this.cargando.set(false);
      },
    });
  }

  irAPagar(): void {
    const pedidoActual = this.pedido();
    if (!pedidoActual) return;

    this.usuarioService.iniciarPago(pedidoActual.idPedido).subscribe({
      next: (resp) => {
        this.preference.set(resp.respuesta); // Guardamos todo el preference
        window.location.href = resp.respuesta.init_point; // Redirigimos al checkout
      }
    });
  }
}