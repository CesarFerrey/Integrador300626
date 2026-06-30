import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ClientesService } from '../services/clientes.service';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    crearCliente(dto: CreateClienteDto, req: any): Promise<{
        id: number;
    }>;
    actualizarCliente(id: number, dto: UpdateClienteDto, req: any): Promise<void>;
    eliminarCliente(id: number, req: any): Promise<{
        message: string;
    }>;
    obtenerClientes(estado: EstadosClientesEnum): Promise<ListClienteDTO[]>;
    obtenerCliente(id: number): Promise<ListClienteDTO>;
}
