import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { Cliente } from './cliente.entity';
import { Tarea } from './tarea.entity';
export declare class Proyecto {
    id: number;
    nombre: string;
    estado: EstadosProyectosEnum;
    idCliente: number;
    proyectoPadreId: number | null;
    proyectoPadre: Proyecto | null;
    proyectosHijos: Proyecto[];
    cliente: Cliente;
    tareas: Tarea[];
}
