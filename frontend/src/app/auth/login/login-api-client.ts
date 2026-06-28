import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginApiClient {
  private readonly client: HttpClient = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3000/api/v1/auth';

  iniciarSesion(email: string, clave: string): Observable<{ accessToken: string }> {
    return this.client.post<{ accessToken: string }>(`${this.baseUrl}/login`, {
      email,
      clave,
    });
  }
}
