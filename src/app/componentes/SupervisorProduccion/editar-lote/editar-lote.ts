import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'
import { EstadoLote } from '../../../model/enums/EstadoLote';
import { SupervisorProduccionService } from '../../../servicios/supervisor-produccion-service';
import { MostrarLoteDTO } from '../../../dto/lote/mostrar-lote-dto';
import { ActualizarLoteDTO } from '../../../dto/lote/actualizar-lote-dto';

@Component({
  selector: 'app-editar-lote',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-lote.html',
  styleUrl: './editar-lote.css'
})
export class EditarLoteComponent implements OnInit {

  loteForm!: FormGroup;
  idLote!: string;
  lote?: MostrarLoteDTO;
  estados = Object.values(EstadoLote);
  cargando = true;

  constructor(private fb: FormBuilder, private supervisorService: SupervisorProduccionService, private router: Router) {}

  ngOnInit(): void {
    this.loteForm = this.fb.group({
      codigoLote: [''],
      fechaProduccion: [''],
      fechaVencimiento: [''],
      cantidadProducida: [''],
      cantidadDisponible: [''],
      estado: [''],
      observaciones: [''],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private inicializarFormulario(): void {
    this.loteForm = this.fb.group({
      codigoLote: ['', Validators.required],
      fechaProduccion: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      cantidadProducida: [0, [Validators.required, Validators.min(1)]],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
      observaciones: [''],
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private cargarLote(): void {
    this.supervisorService.obtenerLote(this.idLote).subscribe({
      next: (res) => {
        this.lote = res.respuesta;
        this.loteForm.patchValue(this.lote);
        this.cargando = false;
      },
      error: (err) => console.error('Error al cargar lote:', err)
    });
  }

  actualizar(): void {
    if (this.loteForm.invalid) return;

    const dto: ActualizarLoteDTO = this.loteForm.value;
    this.supervisorService.actualizarLote(this.idLote, dto).subscribe({
      next: () => this.router.navigate(['/supervisor/lotes/listar-lotes']),
      error: (err) => console.error('Error al actualizar lote:', err)
    });
  }
}
