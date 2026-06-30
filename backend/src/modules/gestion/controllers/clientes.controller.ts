import { Body, Controller, Get, Param, Post, Put, Query, Delete, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ClientesService } from '../services/clientes.service';
import { AuditInterceptor } from '../../../audit/audit.interceptor';
import { Audit } from '../../../audit/audit.decorador';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(AuthGuard)
@UseInterceptors(AuditInterceptor)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiBearerAuth()
  @Post()
  @Audit('Cliente', 'CREATE')
  async crearCliente(@Body() dto: CreateClienteDto, @Req() req: any): Promise<{ id: number }> {
    const user = req.user;
    console.log('👤 Creando cliente - Usuario:', user?.email);
    
    return await this.clientesService.crearClienteConAuditoria(
      dto,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @ApiBearerAuth()
  @Put(':id')
  @Audit('Cliente', 'UPDATE')
  async actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
    @Req() req: any,
  ): Promise<void> {
    const user = req.user;
    console.log('👤 Actualizando cliente - Usuario:', user?.email);
    
    await this.clientesService.actualizarClienteConAuditoria(
      id,
      dto,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Audit('Cliente', 'DELETE')
  async eliminarCliente(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const user = req.user;
    console.log('👤 Eliminando cliente - Usuario:', user?.email);
    
    await this.clientesService.eliminarClienteConAuditoria(
      id,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
    
    return { message: 'Cliente eliminado correctamente' };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListClienteDTO, isArray: true })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: EstadosClientesEnum,
  })
  @Get()
  async obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    return await this.clientesService.obtenerClientes(estado);
  }

  @ApiBearerAuth()
  @Get(':id')
  async obtenerCliente(@Param('id') id: number): Promise<ListClienteDTO> {
    return await this.clientesService.obtenerCliente(id);
  }
}