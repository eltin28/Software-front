import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AdminService } from '../../servicios/admin';
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
  /**
   * Formulario reactivo de creación de productos
   */
  productoForm!: FormGroup;

  /**
   * Listado de tipos de producto basado en el enum
   */
  readonly tiposProducto: string[] = Object.values(TipoProducto);

  private imagenSeleccionada?: File;


  // Inyección de dependencias usando inject() para mayor claridad y testabilidad
  private readonly formBuilder = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario con validadores adecuados
   */
  private inicializarFormulario(): void {
    this.productoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      valor: [0, [Validators.required, Validators.min(1000)]],
      tipo: ['', [Validators.required]],
    });
  }

    /**
   * Maneja el input de tipo file y almacena el archivo seleccionado.
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  /**
   * Envia la imagen al backend, obtiene su URL y luego crea el producto.
   */
  public onSubmit(): void {
    if (this.productoForm.invalid || !this.imagenSeleccionada) {
      this.mostrarAlerta('Formulario inválido', 'Debe completar los campos y subir una imagen.', 'warning');
      return;
    }


    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);

    // Paso 1: Subir la imagen
    this.adminService.subirImagen(formData).subscribe({
      next: (respuestaImagen: { respuesta: ImagenDTO }) => {
        const urlImagen = respuestaImagen.respuesta.url;

        // Paso 2: Crear producto con la URL de la imagen subida
        const nuevoProducto: CrearProductoDTO = {
          ...this.productoForm.value,
          imagenProducto: urlImagen,
        };

        this.crearProducto(nuevoProducto);
      },
      error: () => {
        this.manejarError('No se pudo subir la imagen. Intente nuevamente.');
      },
    });
  }

  private crearProducto(producto: CrearProductoDTO): void {
    this.adminService.crearProducto(producto).subscribe({
      next: (respuesta) => this.manejarExito(respuesta.respuesta),
      error: (error) => this.manejarError(error.error?.respuesta ?? 'Error al crear producto'),
    });
  }

  private manejarExito(mensaje: string): void {
    this.mostrarAlerta('Producto creado', mensaje, 'success').then(() => {
      this.router.navigate(['/modificar-productos']);
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