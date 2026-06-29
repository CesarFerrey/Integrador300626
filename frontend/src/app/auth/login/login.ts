import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginApiClient } from './login-api-client';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../auth-store';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule],
})
export class Login {
  private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly router: Router = inject(Router);

  readonly form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required]),
  });

  iniciarSesion() {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Los campos del formulario son requeridos o inválidos',
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Procesando',
      detail: 'Autenticando usuario...',
    });

    const { email, clave } = this.form.value;

    this.loginApiClient.iniciarSesion(email, clave).subscribe({
      next: (respuesta) => {
        this.authStore.guardarToken(respuesta.accessToken);

        sessionStorage.setItem('accessToken', respuesta.accessToken);

        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'Sesión iniciada correctamente',
        });

        this.router.navigateByUrl('/proyectos');
      },

      error: (err) => {
        let detalleError = 'Usuario o contraseña incorrectos';

        if (err.error?.message) {
          detalleError = err.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: detalleError,
        });
      },
    });
  }
}
