import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsuariosService } from '../../auth/services/usuarios.service';
import { ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiQuery({ name: 'nombre', required: false })
  async findAll(@Query('nombre') nombre?: string) {
    return await this.usuariosService.buscarUsuariosFiltrados(nombre || '');
  }

  @Patch(':id/password')
  @ApiBody({
    schema: { type: 'object', properties: { nuevaClave: { type: 'string' } } },
  })
  async cambiarPassword(
    @Param('id') id: number,
    @Body('nuevaClave') nuevaClave: string, // Cambiado de 'password' a 'nuevaClave'
  ) {
    await this.usuariosService.cambiarPassword(id, nuevaClave);
    return { message: 'Contraseña actualizada correctamente' };
  }

  @Patch('recuperar')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        nuevaClave: { type: 'string' }, // Cambiado de 'password' a 'nuevaClave'
      },
    },
  })
  async recuperarPassword(@Body() body: { email: string; nuevaClave: string }) {
    try {
      return await this.usuariosService.recuperarPassword(
        body.email,
        body.nuevaClave, // Cambiado de 'password' a 'nuevaClave'
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Usuario no encontrado') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw new NotFoundException('Error al recuperar la contraseña');
    }
  }
}
