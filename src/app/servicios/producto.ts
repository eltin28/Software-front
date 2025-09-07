import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearProductoDTO } from '../dto/producto/crear-producto-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/api/productos'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  // Método para crear un producto
  crearProducto(producto: CrearProductoDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  // (Opcional) Obtener lista de productos
  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // (Opcional) Buscar producto por id
  obtenerProducto(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
