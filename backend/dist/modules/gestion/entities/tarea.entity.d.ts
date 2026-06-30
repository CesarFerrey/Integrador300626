import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { Proyecto } from './proyecto.entity';
export declare class Tarea {
    id: number;
    descripcion: string;
    estado: EstadosTareasEnum;
    idProyecto: number;
    tareaPadreId: number | null;
    tareaPadre: Tarea | null;
    tareasHijas: Tarea[];
    proyecto: Proyecto;
}
