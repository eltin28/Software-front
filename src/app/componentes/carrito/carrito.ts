import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InformacionProductoCarritoDTO } from '../../dto/carrito/informacion-producto-carrito-dto';
import { CarritoResponseDTO } from '../../dto/carrito/carrito-response-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { MostrarPedidoDTO } from '../../dto/pedido/mostrar-pedido-dto';
import { UsuarioService } from '../../servicios/usuario';

@Component({
  selector: 'app-carrito',
  imports: [ RouterModule, CurrencyPipe ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito implements OnInit {

  // Signals para un estado reactivo y seguro
  readonly listaCarrito = signal<InformacionProductoCarritoDTO[]>([]);
  readonly carrito = signal<CarritoResponseDTO | null>(null);
  readonly cargando = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private usuarioService: UsuarioService, private router: Router ) {}

  ngOnInit(): void {
    this.cargarCarritoCompleto(); 
  }

  confirmarPedido(): void {
    this.usuarioService.crearPedidoDesdeCarrito().subscribe({
      next: (resp: MensajeDTO<MostrarPedidoDTO>) => {
        // Navega a la vista de detalle del pedido creado
        this.router.navigate(['orden'], { queryParams: { idPedido: resp.respuesta.idPedido } });
      },
      error: err => {
        console.error('Error al confirmar pedido', err);
        this.error.set('No se pudo confirmar el pedido.');
      },
    });
  }

  private cargarCarritoCompleto(): void {
    this.cargando.set(true);

    this.usuarioService.obtenerCarritoCompleto().subscribe({
      next: (respuesta: MensajeDTO<CarritoResponseDTO>) => {
        this.carrito.set(respuesta.respuesta);
        this.listaCarrito.set(respuesta.respuesta.items);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el carrito. Intenta nuevamente.');
        this.cargando.set(false);
      },
    });
  }

  /**
   * Incrementa la cantidad de un producto en el carrito.
   */
  aumentarCantidad(item: InformacionProductoCarritoDTO): void {
    const detalle: DetalleCarritoDTO = {
      idProducto: item.detalleCarritoDTO.idProducto,
      cantidad: 1
    };

    this.usuarioService.agregarItemsAlCarrito([detalle])
      .subscribe({ next: () => this.cargarCarritoCompleto() });
  }

  /**
   * Disminuye la cantidad de un producto en el carrito.
   */
  disminuirCantidad(item: InformacionProductoCarritoDTO): void {
    if (item.detalleCarritoDTO.cantidad > 1) {
      const detalle: DetalleCarritoDTO = {
        idProducto: item.detalleCarritoDTO.idProducto,
        cantidad: -1
      };

      this.usuarioService.agregarItemsAlCarrito([detalle])
        .subscribe({ next: () => this.cargarCarritoCompleto() });
    } else {
      this.eliminarItem(item.detalleCarritoDTO.idProducto);
    }
  }

  /**
   * Elimina un ítem del carrito completamente.
   */
  eliminarItem(idProducto: string): void {
    this.usuarioService.eliminarItemDelCarrito(idProducto)
      .subscribe({ next: () => this.cargarCarritoCompleto() });
  }

  /**
   * Vacía todo el carrito.
   */
  vaciarCarrito(): void {
    this.usuarioService.vaciarCarrito()
      .subscribe({ next: () => this.cargarCarritoCompleto() });
  }

  /**
   * Obtiene la cantidad total de productos en el carrito.
   * Suma todas las cantidades de cada item.
   */
  obtenerCantidadTotal(): number {
    return this.listaCarrito().reduce((suma, item) => 
      suma + item.detalleCarritoDTO.cantidad, 0
    );
  }
}
