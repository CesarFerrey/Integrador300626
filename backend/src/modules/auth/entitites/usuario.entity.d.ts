import { EstadosUsuariosEnum } from "../enums/estados-usuarios.enum";
export declare class Usuario {
    id: number;
    nombre: string;
    clave: string;
    estado: EstadosUsuariosEnum;
}
