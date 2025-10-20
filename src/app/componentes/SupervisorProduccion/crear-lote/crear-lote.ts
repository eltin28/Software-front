import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { CrearLoteDTO } from '../../../dto/lote/crear-lote-dto';
import { GestorProductosService } from '../../../servicios/gestor-productos-service';
import { PublicoService } from '../../../servicios/publicoService';
import { ItemProductoDTO } from '../../../dto/producto/item-producto-dto';

@Component({
  selector: 'app-crear-lote',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-lote.html',
  styleUrl: './crear-lote.css'
})
export class CrearLote implements OnInit {

  loteForm!: FormGroup;
  productos = signal<ItemProductoDTO[]>([]);
  cargandoProductos = signal(true);
  enviando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  // Fecha mínima: hoy
  fechaMinima = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private supervisorService: SupervisorProduccionService,
    private productosService: GestorProductosService,
    private publico: PublicoService,
    private router: Router
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.configurarValidacionFechas();
  }

  private inicializarFormulario(): void {
    this.loteForm = this.fb.group({
      codigoLote: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      idProducto: ['', Validators.required],
      fechaProduccion: [this.fechaMinima, Validators.required],
      fechaVencimiento: ['', Validators.required],
      cantidadProducida: [1, [Validators.required, Validators.min(1)]],
      observaciones: ['', Validators.maxLength(500)]
    });
  }

  private configurarValidacionFechas(): void {
    // Validar que fecha de vencimiento sea posterior a producción
    this.loteForm.get('fechaProduccion')?.valueChanges.subscribe(() => {
      this.loteForm.get('fechaVencimiento')?.updateValueAndValidity();
    });
  }

  private cargarProductos(): void {
    this.cargandoProductos.set(true);
    this.error.set(null);

    // Asumiendo que tienes un servicio para obtener productos
    // Si no existe, deberás crearlo o ajustar según tu implementación
    this.publico.listarProductos().subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.productos.set(resp.respuesta || []);
        } else {
          this.error.set('Error al cargar productos');
        }
        this.cargandoProductos.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error.set('No se pudo cargar la lista de productos');
        this.cargandoProductos.set(false);
      }
    });
  }

  validarFechaVencimiento(): boolean {
    const fechaProduccion = this.loteForm.get('fechaProduccion')?.value;
    const fechaVencimiento = this.loteForm.get('fechaVencimiento')?.value;

    if (fechaProduccion && fechaVencimiento) {
      return new Date(fechaVencimiento) > new Date(fechaProduccion);
    }
    return true;
  }

  generarCodigoAutomatico(): void {
    const idProducto = this.loteForm.get('idProducto')?.value;
    if (!idProducto) {
      return;
    }

    const productoSeleccionado = this.productos().find(p => p.idProducto === idProducto);
    if (!productoSeleccionado) {
      return;
    }

    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // Formato: PROD-YYMMDD-RND (ej: PROD-240115-123)
    const codigo = `${productoSeleccionado.nombreProducto.substring(0, 4).toUpperCase()}-${año}${mes}${dia}-${random}`;
    this.loteForm.patchValue({ codigoLote: codigo });
  }

  onSubmit(): void {
    if (this.loteForm.invalid) {
      this.loteForm.markAllAsTouched();
      return;
    }

    if (!this.validarFechaVencimiento()) {
      this.error.set('La fecha de vencimiento debe ser posterior a la fecha de producción');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const loteDTO: CrearLoteDTO = {
      codigoLote: this.loteForm.value.codigoLote.trim(),
      idProducto: this.loteForm.value.idProducto,
      fechaProduccion: this.loteForm.value.fechaProduccion,
      fechaVencimiento: this.loteForm.value.fechaVencimiento,
      cantidadProducida: this.loteForm.value.cantidadProducida,
      observaciones: this.loteForm.value.observaciones?.trim() || undefined
    };

    this.supervisorService.crearLote(loteDTO).subscribe({
      next: (resp) => {
        if (!resp.error) {
          this.exito.set(true);
          setTimeout(() => {
            this.router.navigate(['/supervisor/lotes']);
          }, 2000);
        } else {
          this.error.set(resp.respuesta || 'Error al crear el lote');
          this.enviando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al crear lote:', err);
        this.error.set(err.error?.respuesta || 'No se pudo crear el lote. Intente nuevamente.');
        this.enviando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/supervisor/lotes']);
  }

  // Helpers para validación en template
  campoInvalido(campo: string): boolean {
    const control = this.loteForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.loteForm.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}`;

    return 'Campo inválido';
  }
}