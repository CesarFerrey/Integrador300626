import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { ProyectosService } from '../services/proyectos.service';
export declare class ProyectosController {
    private readonly proyectosService;
    constructor(proyectosService: ProyectosService);
    crearProyecto(dto: CreateProyectoDto, req: any): Promise<any>;
    actualizarProyecto(id: number, dto: UpdateProyectoDto, req: any): Promise<any>;
    eliminarProyecto(id: number, req: any): Promise<{
        message: string;
    }>;
    obtenerProyectos(): Promise<ListProyectoDTO[]>;
    obtenerProyecto(id: number): Promise<ProyectoDTO>;
}
