import { CreateClienteDto } from "./create-cliente.dto";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";
declare const UpdateClienteDto_base: import("@nestjs/common").Type<Partial<CreateClienteDto>>;
export declare class UpdateClienteDto extends UpdateClienteDto_base {
    estado: EstadosClientesEnum;
}
export {};
