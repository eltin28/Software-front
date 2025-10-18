import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { GestorProductosService } from '../../servicios/gestor-productos-service';
import { MensajeDTO } from '../../dto/autenticacion/mensaje-dto';
import { CrearProductoDTO } from '../../dto/producto/crear-producto-dto';
import { TipoProducto } from '../../model/enums/TipoProducto';
import { ImagenDTO } from '../../dto/producto/imagen-dto';


@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crud-productos.html',
  styleUrls: ['./crud-productos.css'],
})

export class CrudProducto implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly gestorProductosService = inject(GestorProductosService);
  private readonly router = inject(Router);

  productoForm!: FormGroup;
  imagenSeleccionada = signal<File | null>(null);
  readonly tiposProducto = Object.values(TipoProducto);

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      valor: [0, [Validators.required, Validators.min(1000)]],
      tipo: ['', [Validators.required]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.imagenSeleccionada.set(input.files[0]);
  }

  onSubmit(): void {
    if (this.productoForm.invalid || !this.imagenSeleccionada()) {
      this.mostrarAlerta('Formulario inválido', 'Complete los campos y seleccione una imagen.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada()!);

    this.gestorProductosService.subirImagen(formData).subscribe({
      next: (res: MensajeDTO<ImagenDTO>) => {
        const nuevoProducto: CrearProductoDTO = {
          ...this.productoForm.value,
          imagenProducto: res.respuesta.url,
        };
        this.crearProducto(nuevoProducto);
      },
      error: () => this.manejarError('Error al subir la imagen. Intente nuevamente.')
    });
  }

  private crearProducto(dto: CrearProductoDTO): void {
    this.gestorProductosService.crearProducto(dto).subscribe({
      next: (res: MensajeDTO<string>) => this.manejarExito(res.respuesta),
      error: (err) => this.manejarError(err.error?.respuesta ?? 'Error al crear el producto')
    });
  }

  private manejarExito(mensaje: string): void {
    this.mostrarAlerta('Producto creado', mensaje, 'success').then(() => {
      this.router.navigate(['/admin-productos']);
    });
  }

  private manejarError(mensaje: string): void {
    this.mostrarAlerta('Error', mensaje, 'error');
  }

  private mostrarAlerta(
    titulo: string,
    texto: string,
    icono: 'success' | 'error' | 'warning'
  ) {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: 'Aceptar',
    });
  }
}