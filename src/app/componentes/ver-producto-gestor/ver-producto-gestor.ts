import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../servicios/publicoService';
import { ItemProductoDTO } from '../../dto/producto/item-producto-dto';

@Component({
  selector: 'app-ver-producto-gestor',
  imports: [ CommonModule],
  templateUrl: './ver-producto-gestor.html',
  styleUrl: './ver-producto-gestor.css'
})
export class VerProductoGestor {
productos = signal<ItemProductoDTO[]>([]);

  constructor(
    private publicoService: PublicoService,
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
        if (!resp.error) this.productos.set(resp.respuesta);
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  editarProducto(producto: ItemProductoDTO): void {
    this.router.navigate(['/admin-productos/editar', producto.idProducto]);
  }
}