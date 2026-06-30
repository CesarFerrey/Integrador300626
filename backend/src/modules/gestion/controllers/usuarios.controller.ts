// backend/src/usuarios/usuarios.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  UseInterceptors,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsuariosService } from '../../auth/services/usuarios.service';
import { ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from '../../../audit/audit.interceptor';
import { Audit } from '../../../audit/audit.decorador';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(AuthGuard)
@UseInterceptors(AuditInterceptor)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiQuery({ name: 'nombre', required: false })
  async findAll(@Query('nombre') nombre?: string) {
    return await this.usuariosService.buscarUsuariosFiltrados(nombre || '');
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  @Post()
  @Audit('Usuario', 'CREATE')
  async create(@Body() createUsuarioDto: any, @Req() req: any) {
    try {
      const user = req.user;
      console.log('👤 Creando usuario - Usuario:', user?.email);
      
      return await this.usuariosService.create(
        createUsuarioDto,
        user?.id || user?.sub,
        user?.email || user?.username,
        req,
      );
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  @Patch(':id')
  @Audit('Usuario', 'UPDATE')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: any,
    @Req() req: any,
  ) {
    const user = req.user;
    console.log('👤 Actualizando usuario - Usuario:', user?.email);
    
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return await this.usuariosService.update(
      id,
      updateUsuarioDto,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @Delete(':id')
  @Audit('Usuario', 'DELETE')
  async delete(@Param('id') id: number, @Req() req: any) {
    const user = req.user;
    console.log('👤 Eliminando usuario - Usuario:', user?.email);
    
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.usuariosService.delete(
      id,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
    return { message: 'Usuario eliminado correctamente' };
  }

  @Patch(':id/password')
  @Audit('Usuario', 'UPDATE')
  @ApiBody({
    schema: { type: 'object', properties: { nuevaClave: { type: 'string' } } },
  })
  async cambiarPassword(
    @Param('id') id: number,
    @Body('nuevaClave') nuevaClave: string,
    @Req() req: any,
  ) {
    const user = req.user;
    console.log('👤 Cambiando password - Usuario:', user?.email);
    
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return await this.usuariosService.cambiarPasswordConAuditoria(
      id,
      nuevaClave,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @Patch('recuperar')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        nuevaClave: { type: 'string' },
      },
    },
  })
  async recuperarPassword(@Body() body: { email: string; nuevaClave: string }) {
    try {
      return await this.usuariosService.recuperarPassword(
        body.email,
        body.nuevaClave,
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Usuario no encontrado') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw new NotFoundException('Error al recuperar la contraseña');
    }
  }
}