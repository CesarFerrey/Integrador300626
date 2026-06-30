// backend/src/modules/gestion/controllers/proyectos.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { ProyectosService } from '../services/proyectos.service';
import { AuditInterceptor } from '../../../audit/audit.interceptor';
import { Audit } from '../../../audit/audit.decorador';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Proyectos')
@Controller('proyectos')
@UseGuards(AuthGuard)
@UseInterceptors(AuditInterceptor)
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @ApiBearerAuth()
  @Post()
  @Audit('Proyecto', 'CREATE')
  async crearProyecto(@Body() dto: CreateProyectoDto, @Req() req: any): Promise<any> {
    const user = req.user;
    console.log('👤 Creando proyecto - Usuario:', user?.email);
    return await this.proyectosService.crearProyecto(dto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Audit('Proyecto', 'UPDATE')
  async actualizarProyecto(
    @Param('id') id: number,
    @Body() dto: UpdateProyectoDto,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    console.log('👤 Actualizando proyecto - Usuario:', user?.email);
    return await this.proyectosService.actualizarProyecto(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Audit('Proyecto', 'DELETE')
  async eliminarProyecto(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const user = req.user;
    console.log('👤 Eliminando proyecto - Usuario:', user?.email);
    await this.proyectosService.eliminarProyecto(id);
    return { message: 'Proyecto eliminado correctamente' };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
  @Get()
  async obtenerProyectos(): Promise<ListProyectoDTO[]> {
    return await this.proyectosService.obtenerProyectos();
  }

  @ApiBearerAuth()
  @Get(':id')
  async obtenerProyecto(@Param('id') id: number): Promise<ProyectoDTO> {
    return await this.proyectosService.obtenerProyecto(id);
  }
}