import { Body, Controller, Param, Post, Put, Delete, UseGuards, UseInterceptors, Req } from "@nestjs/common";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TareasService } from "../services/tarea.service";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { AuditInterceptor } from '../../../audit/audit.interceptor';
import { Audit } from '../../../audit/audit.decorador';

@ApiTags('Tareas')
@Controller('proyectos/:idProyecto/tareas')
@UseGuards(AuthGuard)
@UseInterceptors(AuditInterceptor)
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }

  @ApiBearerAuth()
  @Post()
  @Audit('Tarea', 'CREATE')
  async crearTarea(
    @Body() dto: CreateTareaDto, 
    @Param('idProyecto') idProyecto: number,
    @Req() req: any
  ): Promise<{ id: number }> {
    const user = req.user;
    console.log('👤 Creando tarea - Usuario:', user?.email);
    
    return await this.tareasService.crearTareaConAuditoria(
      dto, 
      idProyecto,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @ApiBearerAuth()
  @Put(':id')
  @Audit('Tarea', 'UPDATE')
  async actualizarTarea(
    @Body() dto: UpdateTareaDto, 
    @Param('id') id: number,
    @Param('idProyecto') idProyecto: number,
    @Req() req: any
  ): Promise<void> {
    const user = req.user;
    console.log('👤 Actualizando tarea - Usuario:', user?.email);
    
    await this.tareasService.actualizarTareaConAuditoria(
      dto, 
      id,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Audit('Tarea', 'DELETE')
  async eliminarTarea(
    @Param('id') id: number,
    @Param('idProyecto') idProyecto: number,
    @Req() req: any
  ): Promise<{ message: string }> {
    const user = req.user;
    console.log('👤 Eliminando tarea - Usuario:', user?.email);
    
    await this.tareasService.eliminarTareaConAuditoria(
      id,
      user?.id || user?.sub,
      user?.email || user?.username,
      req,
    );
    
    return { message: 'Tarea eliminada correctamente' };
  }
}