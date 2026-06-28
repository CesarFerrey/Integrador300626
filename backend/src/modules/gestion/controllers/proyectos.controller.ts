import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { ProyectosService } from '../services/proyectos.service';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @ApiBearerAuth()
  // Seguridad desactivada temporalmente para la entrega
  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    return await this.proyectosService.crearProyecto(dto);
  }

  @ApiBearerAuth()
  @Put(':id')
  async actualizarProyecto(
    @Body() dto: UpdateProyectoDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.proyectosService.actualizarProyecto(id, dto);
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
