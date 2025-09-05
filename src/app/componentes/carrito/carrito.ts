import { Component, OnInit } from '@angular/core';
import { InformacionProductoCarritoDTO } from '../../dto/carrito/informacion-producto-carrito-dto';
import { CarritoResponseDTO } from '../../dto/carrito/carrito-response-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { UsuarioService } from '../../servicios/usuario';
import { TokenService } from '../../servicios/token.service';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [ RouterModule, CurrencyPipe ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito implements OnInit {

  listaCarrito: InformacionProductoCarritoDTO[] = [];
  carrito: CarritoResponseDTO | null = null;
  private idUsuario: string = '';

  constructor(private usuarioService: UsuarioService, 
              private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.tokenService.getAllTokenData().id;
    this.cargarCarritoCompleto();
  }

  /**
   * Carga el carrito completo desde el backend (items y total).
   */
  private cargarCarritoCompleto(): void {
    this.usuarioService.obtenerCarritoCompleto(this.idUsuario).subscribe({
      next: (respuesta: MensajeDTO<CarritoResponseDTO>) => {
        this.carrito = respuesta.respuesta;
        this.listaCarrito = this.carrito.items;
      },
      error: (err) => {
        console.error('Error cargando carrito:', err);
      }
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

    this.usuarioService.agregarItemsAlCarrito(this.idUsuario, [detalle]).subscribe({
      next: () => this.cargarCarritoCompleto(),
      error: (err) => console.error('Error al aumentar cantidad:', err)
    });
  }

  /**
   * Disminuye la cantidad de un producto en el carrito.
   * Si la cantidad llega a 1 y se disminuye, se elimina el ítem.
   */
  disminuirCantidad(item: InformacionProductoCarritoDTO): void {
    if (item.detalleCarritoDTO.cantidad > 1) {
      const detalle: DetalleCarritoDTO = {
        idProducto: item.detalleCarritoDTO.idProducto,
        cantidad: -1 
      };

      this.usuarioService.agregarItemsAlCarrito(this.idUsuario, [detalle]).subscribe({
        next: () => this.cargarCarritoCompleto(),
        error: (err) => console.error('Error al disminuir cantidad:', err)
      });
    } else {
      this.eliminarItem(item.detalleCarritoDTO.idProducto);
    }
  }

  /**
   * Elimina un ítem del carrito completamente.
   */
  eliminarItem(idProducto: string): void {
    this.usuarioService.eliminarItemDelCarrito(this.idUsuario, idProducto).subscribe({
      next: () => this.cargarCarritoCompleto(),
      error: (err) => console.error('Error al eliminar ítem:', err)
    });
  }

  /**
   * Vacía todo el carrito.
   */
  vaciarCarrito(): void {
    this.usuarioService.vaciarCarrito(this.idUsuario).subscribe({
      next: () => this.cargarCarritoCompleto(),
      error: (err) => console.error('Error al vaciar carrito:', err)
    });
  }
}
