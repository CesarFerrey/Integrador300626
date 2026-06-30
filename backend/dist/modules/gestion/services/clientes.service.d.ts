import { Cliente } from "../entities/cliente.entity";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { Repository } from "typeorm";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { ProyectosService } from "./proyectos.service";
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';
export declare class ClientesService {
    private readonly repository;
    private readonly proyectosService;
    private readonly auditService;
    constructor(repository: Repository<Cliente>, proyectosService: ProyectosService, auditService: AuditService);
    crearCliente(dto: CreateClienteDto): Promise<{
        id: number;
    }>;
    crearClienteConAuditoria(dto: CreateClienteDto, userId?: string, userEmail?: string, req?: Request): Promise<{
        id: number;
    }>;
    actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void>;
    actualizarClienteConAuditoria(id: number, dto: UpdateClienteDto, userId?: string, userEmail?: string, req?: Request): Promise<void>;
    eliminarClienteConAuditoria(id: number, userId?: string, userEmail?: string, req?: Request): Promise<void>;
    obtenerClientes(estado: EstadosClientesEnum): Promise<ListClienteDTO[]>;
    obtenerCliente(id: number): Promise<ListClienteDTO>;
    existeClienteActivoPorId(id: number): Promise<boolean>;
}
