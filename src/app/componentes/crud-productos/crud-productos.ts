import { Component } from '@angular/core';

@Component({
  selector: 'app-crud-productos',
  imports: [],
  templateUrl: './crud-productos.html',
  styleUrl: './crud-productos.css'
})
export class CrudProductos {
  producto: CrearProductoDTO = {
    nombreProducto: '',
    imagenProducto: '',
    cantidad: 0,
    valor: 0,
    tipo: ''
  };

  constructor(private productoService: ProductoService) {}

  onSubmit(): void {
    this.productoService.crearProducto(this.producto).subscribe({
      next: (respuesta) => {
        console.log('✅ Producto creado:', respuesta);
        alert(`Producto "${respuesta.nombreProducto}" creado con éxito`);
        // limpiar formulario
        this.producto = {
          nombreProducto: '',
          imagenProducto: '',
          cantidad: 0,
          valor: 0,
          tipo: ''
        };
      },
      error: (err) => {
        console.error('❌ Error al crear producto:', err);
        alert('Hubo un error al crear el producto');
      }
    });
  }
}
