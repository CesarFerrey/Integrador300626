import { EstadosClientesEnum } from "../estados-clientes-enum";
//import { CreateClienteDTO } from "./create-cliente-dto";

export interface UpdateClienteDto {
    nombre: string;
    email: string;
    telefono: string;
    estado: EstadosClientesEnum;
}