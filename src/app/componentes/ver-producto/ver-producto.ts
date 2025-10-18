import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicoService } from '../../servicios/publicoService';
import { UsuarioService } from '../../servicios/usuario';
import { TokenService } from '../../servicios/token.service';
import { ProductoDetalleDTO } from '../../dto/producto/producto-detalle-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { MatSnackBar  } from '@angular/material/snack-bar';
import { CarritoDTO } from '../../dto/carrito/carrito-dto';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';

@Component({
  selector: 'app-ver-producto',
  imports: [ CommonModule ],
  templateUrl: './ver-producto.html',
  styleUrl: './ver-producto.css'
})
export class VerProducto implements OnInit {

  private route = inject(ActivatedRoute);
  private publicoService = inject(PublicoService);
  private usuarioService = inject(UsuarioService);
  private tokenService = inject(TokenService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  producto = signal<ProductoDetalleDTO | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarProducto(id);
  }

  private cargarProducto(id: string): void {
    this.loading.set(true);
    this.publicoService.obtenerProductoPorId(id).subscribe({
      next: (resp) => {
        this.producto.set(resp.respuesta);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  agregarAlCarrito(): void {
    if (!this.tokenService.isLogged()) {
      this.router.navigate(['/login']);
      return;
    }

    const prod = this.producto();
    if (!prod) return;

    const item: DetalleCarritoDTO = { idProducto: prod.idProducto, cantidad: 1 };

    this.usuarioService.agregarItemsAlCarrito([item]).subscribe({
      next: (resp: MensajeDTO<CarritoDTO>) => {
        if (!resp.error) {
          this.snackBar.open('Producto agregado al carrito', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Error al agregar al carrito', 'Cerrar', { duration: 3000 });
      }
    });
  }
}