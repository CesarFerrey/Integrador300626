import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "../entities/cliente.entity";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { FindOptionsWhere, Repository } from "typeorm";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { ProyectosService } from "./proyectos.service";
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';

@Injectable()
export class ClientesService {

    constructor(
        @InjectRepository(Cliente) private readonly repository: Repository<Cliente>,
        @Inject(forwardRef(() => ProyectosService)) private readonly proyectosService: ProyectosService,
        private readonly auditService: AuditService,
    ) {}

    async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
        const cliente: Cliente = this.repository.create(dto);
        cliente.estado = EstadosClientesEnum.ACTIVO;
        await this.repository.save(cliente);
        return { id: cliente.id };
    }

    // Nuevo método con auditoría
    async crearClienteConAuditoria(
        dto: CreateClienteDto,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<{ id: number }> {
        const resultado = await this.crearCliente(dto);
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Cliente',
                String(resultado.id),
                'CREATE',
                { after: dto },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría CREATE registrada para cliente:', resultado.id);
        }
        
        return resultado;
    }

    async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
        const cliente: Cliente | null = await this.repository.findOneBy({ id });

        if (!cliente) {
            throw new BadRequestException('Cliente no encontrado');
        }

        const relacionadoConProyectos: boolean = await this.proyectosService.existeProyectoPorIdCliente(id);

        if (relacionadoConProyectos && dto.estado === EstadosClientesEnum.BAJA) {
            throw new BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
        }

        this.repository.merge(cliente, dto);
        await this.repository.save(cliente);
    }

    // Nuevo método con auditoría
    async actualizarClienteConAuditoria(
        id: number,
        dto: UpdateClienteDto,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<void> {
        // Obtener estado antes
        const before = await this.repository.findOne({ where: { id } });
        
        await this.actualizarCliente(id, dto);
        
        // Obtener estado después
        const after = await this.repository.findOne({ where: { id } });
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Cliente',
                String(id),
                'UPDATE',
                { before, after },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría UPDATE registrada para cliente:', id);
        }
    }

    async eliminarClienteConAuditoria(
        id: number,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<void> {
        // Obtener estado antes
        const before = await this.repository.findOne({ where: { id } });
        
        if (!before) {
            throw new BadRequestException('Cliente no encontrado');
        }
        
        await this.repository.delete(id);
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Cliente',
                String(id),
                'DELETE',
                { before },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría DELETE registrada para cliente:', id);
        }
    }

    async obtenerClientes(estado: EstadosClientesEnum): Promise<ListClienteDTO[]> {
        const whereCondition: FindOptionsWhere<ListClienteDTO> = {}

        if (estado){
            whereCondition.estado = estado
        }

        const clientes: Cliente[] = await this.repository.find({ 
            select: { id: true, nombre: true, estado: true }, 
            order: { id: 'ASC' }, 
            where: whereCondition 
        });

        const dtoList: ListClienteDTO[] = [];

        for (const c of clientes) {
            const dto = new ListClienteDTO();
            dto.id = c.id;
            dto.nombre = c.nombre;
            dto.estado = c.estado;
            dtoList.push(dto);
        }

        return dtoList;
    }

    // NUEVO MÉTODO: Obtener un cliente por ID
    async obtenerCliente(id: number): Promise<ListClienteDTO> {
        const cliente = await this.repository.findOne({ 
            where: { id },
            select: { id: true, nombre: true, estado: true }
        });

        if (!cliente) {
            throw new BadRequestException('Cliente no encontrado');
        }

        const dto = new ListClienteDTO();
        dto.id = cliente.id;
        dto.nombre = cliente.nombre;
        dto.estado = cliente.estado;
        
        return dto;
    }

    async existeClienteActivoPorId(id: number): Promise<boolean> {
        const existe: boolean = await this.repository.exists({ 
            where: { id, estado: EstadosClientesEnum.ACTIVO } 
        });
        return existe;
    }
}