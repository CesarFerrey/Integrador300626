import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { TareasService } from "../services/tarea.service";
export declare class TareasController {
    private readonly tareasService;
    constructor(tareasService: TareasService);
    crearTarea(dto: CreateTareaDto, idProyecto: number, req: any): Promise<{
        id: number;
    }>;
    actualizarTarea(dto: UpdateTareaDto, id: number, idProyecto: number, req: any): Promise<void>;
    eliminarTarea(id: number, idProyecto: number, req: any): Promise<{
        message: string;
    }>;
}
