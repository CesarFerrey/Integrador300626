import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListClienteDTO } from "./list-cliente.dto";
export declare class ListProyectoDTO {
    id: number;
    nombre: string;
    estado: EstadosProyectosEnum;
    fechaFin?: Date;
    cliente: ListClienteDTO;
}
