import { Component, Input } from '@angular/core'; // IMPORTANTE: Input debe estar aquí
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service'; // Asegúrate que esta ruta sea correcta

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cambiar-password.component.html'
})
export class CambiarPasswordComponent {
  @Input() userId!: number;
  nuevaPassword: string = '';

  constructor(private usuariosService: UsuariosService) {}

  guardar() {
    if (!this.nuevaPassword) {
      alert('Escribe una nueva contraseña');
      return;
    }

    // Usamos 'any' en res y err para evitar el error TS7006
    this.usuariosService.cambiarPassword(this.userId, this.nuevaPassword).subscribe({
      next: (res: any) => {
        alert('Contraseña actualizada correctamente');
        this.nuevaPassword = '';
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al actualizar');
      }
    });
  }
}