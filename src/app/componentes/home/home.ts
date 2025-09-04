import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { publicoService } from '../../servicios/publicoService';
import { ItemProductoDTO } from '../../dto/producto/item-producto-dto';

@Component({
  selector: 'app-home',
  imports: [ RouterModule, CommonModule ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  productos = signal<ItemProductoDTO[]>([]);

  constructor(private productoService: publicoService) {}

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
    console.log('Producto agregado:', producto);
    // Aquí luego conectas con tu servicio Carrito
  }
}
