import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';

import { RegisterApiClient }
from './register-api-client';

const passwordMatchValidator:
ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password =
    control.get('password');

  const confirmPassword =
    control.get('confirmPassword');

  return password &&
    confirmPassword &&
    password.value ===
      confirmPassword.value
    ? null
    : { mismatch: true };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RouterModule
  ]
})
export class Register {

  private readonly messageService:
    MessageService =
      inject(MessageService);

  private readonly router:
    Router =
      inject(Router);

  private readonly registerApiClient =
    inject(RegisterApiClient);

  readonly registerForm:
    FormGroup = new FormGroup({

    nombre: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ),

    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.email
      ]
    ),

    password: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ),

    confirmPassword:
      new FormControl(
        '',
        [Validators.required]
      )

  }, {
    validators:
      passwordMatchValidator
  });

  onSubmit(): void {

    if (!this.registerForm.valid) {

      this.registerForm.markAllAsTouched();

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Por favor, revisá los campos del formulario.'
      });

      return;
    }

    const {
      nombre,
      email,
      password
    } = this.registerForm.value;

    this.messageService.add({
      severity: 'info',
      summary: 'Procesando',
      detail:
        'Registrando usuario...'
    });

    this.registerApiClient
      .registrar(
        nombre,
        email,
        password
      )
      .subscribe({

        next: () => {

          this.messageService.add({
            severity: 'success',
            summary:
              '¡Registro exitoso!',
            detail:
              'Usuario registrado correctamente'
          });

          this.router
            .navigateByUrl('/login');
        },

        error: (err) => {

          console.error(err);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo registrar el usuario'
          });
        }
      });
  }
}