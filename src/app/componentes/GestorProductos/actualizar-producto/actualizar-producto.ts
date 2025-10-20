import { Component, OnInit } from '@angular/core';
import { inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PublicoService } from '../../../servicios/publicoService';
import { GestorProductosService } from '../../../servicios/gestor-productos-service';
import { MensajeDTO } from '../../../dto/autenticacion/mensaje-dto';
import { ImagenDTO } from '../../../dto/producto/imagen-dto';
import { ProductoDetalleDTO } from '../../../dto/producto/producto-detalle-dto';
import { EditarProductoDTO } from '../../../dto/producto/editar-producto-dto';
import { MatSnackBar  } from '@angular/material/snack-bar';
import { TipoProducto } from '../../../model/enums/TipoProducto';

@Component({
  selector: 'app-actualizar-producto',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './actualizar-producto.html',
  styleUrl: './actualizar-producto.css'
})

export class ActualizarProducto implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly publicoService = inject(PublicoService);
  private readonly gestorService = inject(GestorProductosService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  producto = signal<ProductoDetalleDTO | null>(null);
  loading = signal<boolean>(false);
  imagenSeleccionada?: File;
  form!: FormGroup;
  idProducto!: string;
  tiposProducto = signal<string[]>([]);

  ngOnInit(): void {
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    this.inicializarFormulario();
    this.cargarProducto();
    this.cargarTiposProducto();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      valor: [0, [Validators.required, Validators.min(0)]],
      tipo: ['', Validators.required],
      imagenProducto: ['']
    });
  }

  private cargarProducto(): void {
    this.loading.set(true);
    this.publicoService.obtenerProductoPorId(this.idProducto).subscribe({
      next: (res: MensajeDTO<ProductoDetalleDTO>) => {
        this.producto.set(res.respuesta);
        
        // Mapear los nombres de propiedades diferentes
        const formData = {
          nombre: res.respuesta.nombreProducto, 
          descripcion: res.respuesta.descripcion,
          valor: res.respuesta.valor,
          tipo: res.respuesta.tipo,
          imagenProducto: res.respuesta.imagenProducto
        };
        
        this.form.patchValue(formData);
        this.loading.set(false);
      },
      error: () => this.mostrarMensaje('Error al cargar el producto')
    });
  }

  private cargarTiposProducto(): void {
    const tipos = Object.values(TipoProducto);
    this.tiposProducto.set(tipos);
  }

  actualizar(): void {
    if (this.form.invalid) return;

    const dto: EditarProductoDTO = this.form.value;
    this.loading.set(true);

    this.gestorService.actualizarProducto(this.idProducto, dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/gestor/home']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminar(): void {
    if (!confirm('¿Seguro que desea eliminar este producto?')) return;

    this.loading.set(true);
    this.gestorService.eliminarProducto(this.idProducto).subscribe({
      next: () => {
        this.loading.set(false);
        this.mostrarMensaje('Producto eliminado correctamente');
        this.router.navigate(['/gestor/home']);
      },
      error: () => this.mostrarMensaje('Error al eliminar el producto')
    });
  }

  // ================== MANEJO DE IMÁGENES ==================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imagenSeleccionada = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
      };
      reader.readAsDataURL(this.imagenSeleccionada);
    }
  }

  subirImagen(): void {
    if (!this.imagenSeleccionada) return;

    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);

    this.loading.set(true);
    this.gestorService.subirImagen(formData).subscribe({
      next: (res: MensajeDTO<ImagenDTO>) => {
        const url = res.respuesta.url;
        this.form.patchValue({ imagenProducto: url });
        this.mostrarMensaje('Imagen subida correctamente');
        this.loading.set(false);
        this.imagenSeleccionada = undefined;
        
        // Limpiar el input file
        const fileInput = document.querySelector('.file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: () => this.mostrarMensaje('Error al subir la imagen')
    });
  }

  eliminarImagen(): void {
    const urlActual = this.form.value.imagenProducto;
    if (!urlActual) return;

    const publicId = this.extraerPublicId(urlActual);
    if (!publicId) {
      this.mostrarMensaje('No se pudo determinar el ID de la imagen');
      return;
    }

    this.loading.set(true);
    this.gestorService.eliminarImagen(publicId).subscribe({
      next: () => {
        this.form.patchValue({ imagenProducto: '' });
        this.mostrarMensaje('Imagen eliminada correctamente');
        this.loading.set(false);
      },
      error: () => this.mostrarMensaje('Error al eliminar la imagen')
    });
  }

  private extraerPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?([^/.]+)/);
    return match ? match[1] : null;
  }

  private mostrarMensaje(mensaje: string): void {
    this.loading.set(false);
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}