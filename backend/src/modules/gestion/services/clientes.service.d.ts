import { Cliente } from "../entities/cliente.entity";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { Repository } from "typeorm";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { ProyectosService } from "./proyectos.service";
export declare class ClientesService {
    private readonly repository;
    private readonly proyectosService;
    constructor(repository: Repository<Cliente>, proyectosService: ProyectosService);
    crearCliente(dto: CreateClienteDto): Promise<{
        id: number;
    }>;
    actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void>;
    obtenerClientes(estado: EstadosClientesEnum): Promise<ListClienteDTO[]>;
    existeClienteActivoPorId(id: number): Promise<boolean>;
}
