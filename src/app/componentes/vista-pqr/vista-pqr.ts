import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../servicios/token.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-validar-rol',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validar-rol.html',
  styleUrls: ['./validar-rol.css']
})
export class ValidarRolComponent implements OnInit {

  usuario: any = null;
  rol: string = '';
  mensaje: string = '';

  private apiUrl = `${environment.apiUrl}/usuarios`; // 🔹 Ajusta el endpoint si tu backend usa otro nombre

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.tokenService.getUserId(); //  Obtiene el ID desde el token

    if (!userId) {
      this.mensaje = 'No se pudo obtener el ID del usuario. Inicia sesión nuevamente.';
      return;
    }

    //  Llamar al backend para obtener los datos del usuario por ID
    this.http.get(`${this.apiUrl}/${userId}`).subscribe({
      next: (response: any) => {
        this.usuario = response;
        this.rol = response.rol || response.respuesta?.rol || '';

        // Validar rol
        if (this.rol === 'ADMINISTRADOR') {
          this.mensaje = ' Bienvenido Administrador';
        } else if (this.rol === 'WORKER') {
          this.mensaje = '️ Bienvenido Trabajador';
        } else {
          this.mensaje = ' Usuario sin permisos especiales.';
        }

        console.log(' Usuario cargado:', this.usuario);
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
        this.mensaje = 'Error al obtener información del usuario.';
      }
    });
  }
/*
  // Método para consultar todos los PQR creados
  obtenerPqr(): void {
    this.http.get(`${this.apiUrlPqr}/listar`).subscribe({
      next: (resp: any) => {
        // Dependiendo de cómo responda tu backend, ajusta el acceso a los datos
        this.listaPqr = resp.respuesta ?? resp ?? [];
        console.log('📋 PQR encontrados:', this.listaPqr);
      },
      error: (err) => {
        console.error(' Error al obtener PQR:', err);
        this.mensaje = 'Error al cargar los PQR.';
      }
    });
  }*/
}
