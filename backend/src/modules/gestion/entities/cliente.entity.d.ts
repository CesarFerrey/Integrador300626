import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { Proyecto } from "./proyecto.entity";
export declare class Cliente {
    id: number;
    nombre: string;
    estado: EstadosClientesEnum;
    proyectos: Proyecto[];
}
