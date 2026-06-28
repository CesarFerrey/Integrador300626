import {
  Controller,
  Put,
  Param,
  ParseIntPipe,
  Get,
  Query,
} from '@nestjs/common'; // <--- Agregamos Get y Query
import { UsuariosService } from '../services/usuarios.service';

@Controller('admin/usuarios')
export class AdminController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Nueva ruta para buscar: GET /admin/usuarios/buscar?criterio=...
  @Get('buscar')
  async buscarUsuarios(@Query('criterio') criterio: string) {
    return await this.usuariosService.buscarUsuariosFiltrados(criterio);
  }

  // Ruta para activar un usuario: PUT /admin/usuarios/:id/activar
  @Put(':id/activar')
  async activarUsuario(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.activarUsuario(id);
    return;
  }
}
