import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { publicoService } from '../../servicios/publicoService';
import { ItemProductoDTO } from '../../dto/producto/item-producto-dto';
import { TokenService } from '../../servicios/token.service';
import { UsuarioService } from '../../servicios/usuario';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CarritoDTO } from '../../dto/carrito/carrito-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ RouterModule, CommonModule ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  productos = signal<ItemProductoDTO[]>([]);

  constructor(private productoService: publicoService,
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
    this.productoService.listarProductos().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productos.set(resp.respuesta);
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  agregarAlCarrito(producto: ItemProductoDTO): void {
    if (!this.tokenService.isLogged()) {
      this.router.navigate(['/login']);
      return;
    }

    const idUsuario = this.tokenService.getAllTokenData().id;

    const item: DetalleCarritoDTO = {
      idProducto: producto.idProducto,
      cantidad: 1
    };

    this.usuarioService.agregarItemsAlCarrito([item]).subscribe({
      next: (resp: MensajeDTO<CarritoDTO>) => {
        if (!resp.error) {
          console.log('Producto agregado correctamente:', resp.respuesta);
        }
      },
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
      }
    });
  }
}
