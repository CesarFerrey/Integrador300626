import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [FormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css',
})
export class RecuperarPasswordComponent {
  email: string = '';
  nuevaClave: string = '';
  confirmarClave: string = '';

  constructor(private http: HttpClient) {}

  guardar() {
    if (this.nuevaClave !== this.confirmarClave) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // AGREGA EL /v1/ AQUÍ
    this.http
      .patch('http://localhost:3000/api/v1/usuarios/recuperar', {
        email: this.email,
        nuevaClave: this.nuevaClave,
      })
      .subscribe({
        next: () => alert('Contraseña actualizada con éxito'),
        error: (err) => {
          console.error(err);
          alert('Error al actualizar la contraseña');
        },
      });
  }
}
