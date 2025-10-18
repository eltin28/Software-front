import { Component, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../servicios/publicoService';
import { ItemProductoDTO } from '../../dto/producto/item-producto-dto';
import { TokenService } from '../../servicios/token.service';
import { UsuarioService } from '../../servicios/usuario';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CarritoDTO } from '../../dto/carrito/carrito-dto';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  productos = signal<ItemProductoDTO[]>([]);

  constructor(
    private publicoService: PublicoService,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  get listaProductos(): ItemProductoDTO[] {
    return this.productos();
  }

  private cargarProductos(): void {
    this.publicoService.listarProductos().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productos.set(resp.respuesta);
        }
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  verProducto(id: string): void {
    this.router.navigate(['/producto', id]);
  }

  agregarAlCarrito(producto: ItemProductoDTO): void {
    if (!this.tokenService.isLogged()) {
      this.router.navigate(['/login']);
      return;
    }

    const item: DetalleCarritoDTO = {
      idProducto: producto.idProducto,
      cantidad: 1
    };

    this.usuarioService.agregarItemsAlCarrito([item]).subscribe({
      next: (resp: MensajeDTO<CarritoDTO>) => {
        if (!resp.error) console.log('Producto agregado al carrito:', resp.respuesta);
      },
      error: (err) => console.error('Error al agregar al carrito:', err)
    });
  }
}
