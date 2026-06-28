import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  // Mantenemos la URL base con la versión
  private apiUrl = 'http://localhost:3000/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  cambiarPassword(id: number, nuevaClave: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/password`, { nuevaClave });
  }

  recuperarPassword(email: string, nuevaClave: string): Observable<any> {
    // Aseguramos que la ruta final sea .../api/v1/usuarios/recuperar
    return this.http.patch(`${this.apiUrl}/recuperar`, { email, nuevaClave });
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }
}