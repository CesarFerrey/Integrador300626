import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";
export declare class ListClienteDTO {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    estado: EstadosClientesEnum;
}
