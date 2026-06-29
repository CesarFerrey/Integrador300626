import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListTareaDTO } from "./list-tarea.dto";
export declare class ProyectoDTO {
    nombre: string;
    estado: EstadosProyectosEnum;
    cliente: string;
    tareas: ListTareaDTO[];
}
