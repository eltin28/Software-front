import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PublicoService } from '../../../servicios/publicoService';
import { ItemProductoDTO } from '../../../dto/producto/item-producto-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-productos-home',
  imports: [ CommonModule],
  templateUrl: './gestor-productos-home.html',
  styleUrl: './gestor-productos-home.css'
})
export class GestorProductosHome implements OnInit {

  productos = signal<ItemProductoDTO[]>([]);
  cargando = signal<boolean>(true);

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

  get estaCargando(): boolean {
    return this.cargando();
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    
    this.publicoService.listarProductos().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productos.set(resp.respuesta);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando.set(false);
      }
    });
  }

  verProducto(id: string): void {
    this.router.navigate(['/gestor/productos', id]);
  }

  editarProducto(id: string): void {
    this.router.navigate(['/gestor/productos/editar', id]);
  }

  crearProducto(): void {
    this.router.navigate(['/gestor/productos/nuevo']);
  }
}