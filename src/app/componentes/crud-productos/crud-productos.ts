import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../servicios/producto';
import { CrearProductoDTO } from '../../dto/producto/crear-producto-dto';
import Swal from 'sweetalert2';
import {TipoProducto} from '../../model/enums/TipoProducto';

@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './crud-productos.html',
  styleUrls: ['./crud-productos.css']
})
export class CrudProducto implements OnInit {
  productoForm!: FormGroup;
  tiposProducto = Object.values(TipoProducto);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      imagenProducto: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      valor: [0, [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required]
    });
  }

  crearProducto(): void {
    if (this.productoForm.invalid) return;

    const nuevoProducto = this.productoForm.value as CrearProductoDTO;

    this.productoService.crearProducto(nuevoProducto).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Producto creado correctamente', 'success');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        Swal.fire('Error', err.error?.respuesta || 'No se pudo crear el producto', 'error');
      }
    });
  }
}

