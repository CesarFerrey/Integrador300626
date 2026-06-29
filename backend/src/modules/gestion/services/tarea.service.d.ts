import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { Tarea } from "../entities/tarea.entity";
import { Repository } from "typeorm";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
export declare class TareasService {
    private readonly tareasRepository;
    constructor(tareasRepository: Repository<Tarea>);
    crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{
        id: number;
    }>;
    actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void>;
}
