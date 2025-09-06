import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InformacionProductoCarritoDTO } from '../../dto/carrito/informacion-producto-carrito-dto';
import { CarritoResponseDTO } from '../../dto/carrito/carrito-response-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { finalize } from 'rxjs';
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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarCarritoCompleto();
  }

  /**
   * Carga el carrito completo desde el backend (items y total).
   */
  private cargarCarritoCompleto(): void {

    this.usuarioService.obtenerCarritoCompleto()
      .subscribe({
        next: (respuesta: MensajeDTO<CarritoResponseDTO>) => {
          this.carrito.set(respuesta.respuesta);
          this.listaCarrito.set(respuesta.respuesta.items);
        },
        error: () => this.error.set('No se pudo cargar el carrito. Intenta nuevamente.')
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
}
