import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RegisterApiClient {

  private readonly client: HttpClient = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:3000/api/v1/auth';

  registrar(
    nombre: string,
    email: string,
    clave: string
  ): Observable<any> {

    return this.client.post(
      `${this.baseUrl}/registrar`,
      {
        nombre,
        email,
        clave
      }
    );
  }
}