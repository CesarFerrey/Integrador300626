// backend/src/modules/gestion/services/proyectos.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProyectoDto } from "../dtos/input/create-proyecto.dto";
import { Proyecto } from "../entities/proyecto.entity";
import { Repository, In } from "typeorm";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { UpdateProyectoDto } from "../dtos/input/update-proyecto.dto";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ListProyectoDTO } from "../dtos/output/list-proyecto.dto";
import { ProyectoDTO } from "../dtos/output/proyecto.dto";
import { ListTareaDTO } from "../dtos/output/list-tarea.dto";
import { ClientesService } from "./clientes.service";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";

@Injectable()
export class ProyectosService {

    constructor(
        @InjectRepository(Proyecto) private readonly repository: Repository<Proyecto>,
        @Inject(forwardRef(() => ClientesService)) private readonly clientesService: ClientesService
    ) { }

    async crearProyecto(dto: CreateProyectoDto): Promise<Proyecto> {
        if (!dto.idCliente) {
            throw new BadRequestException('Se debe especificar un ID de cliente válido para el proyecto');
        }

        const clienteActivo: boolean = await this.clientesService.existeClienteActivoPorId(dto.idCliente);
        if (!clienteActivo) {
            throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
        }

        // Evitamos pasar el string "estado" si viene en el DTO para eludir el error TS2769
        const { estado, ...datosProyecto } = dto as any;
        
        // Agregamos "as Proyecto" para solucionar el error TS2740 (evita que piense que puede ser Proyecto[])
        const proyecto = this.repository.create(datosProyecto) as unknown as Proyecto;
        proyecto.estado = EstadosProyectosEnum.ACTIVO;
        proyecto.cliente = { id: dto.idCliente } as any;

        return await this.repository.save(proyecto);
    }

    async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<Proyecto> {
        const proyecto: Proyecto | null = await this.repository.findOne({ where: { id } });

        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }

        if (dto.idCliente) {
            const clienteActivo: boolean = await this.clientesService.existeClienteActivoPorId(dto.idCliente);
            if (!clienteActivo) {
                throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
            }
            proyecto.cliente = { id: dto.idCliente } as any;
        }

        this.repository.merge(proyecto, dto);
        await this.repository.save(proyecto);

        // Retornamos el objeto fresco de la base de datos para que actúe el interceptor de auditoría
        const actualizado = await this.repository.findOne({ where: { id } });
        return actualizado!;
    }

    async eliminarProyecto(id: number): Promise<void> {
        const proyecto = await this.repository.findOne({ where: { id } });
        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }
        await this.repository.delete(id);
    }

    async obtenerProyectos(): Promise<ListProyectoDTO[]> {
        const proyectos: Proyecto[] = await this.repository.find({ relations: { cliente: true }, order: { id: 'ASC' } });
        const dtoList: ListProyectoDTO[] = [];

        for (const p of proyectos) {
            const dto = new ListProyectoDTO();
            dto.id = p.id;
            dto.nombre = p.nombre;
            dto.estado = p.estado;
            if (p.cliente) {
                dto.cliente = new ListClienteDTO();
                dto.cliente.id = p.cliente.id;
                dto.cliente.nombre = p.cliente.nombre;
                dto.cliente.estado = p.cliente.estado;
            }
            dtoList.push(dto);
        }

        return dtoList;
    }

    async obtenerProyecto(id: number): Promise<ProyectoDTO> {
        const proyecto: Proyecto | null = await this.repository.findOne({ 
            where: { id }, 
            relations: { cliente: true, tareas: true }, 
            order: { tareas: { id: 'ASC' } } 
        });

        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }

        const dto = new ProyectoDTO();
        dto.nombre = proyecto.nombre;
        dto.estado = proyecto.estado;
        if (proyecto.cliente) {
            dto.cliente = proyecto.cliente.nombre;
        }
        
        const tareas: ListTareaDTO[] = [];
        for (const t of proyecto.tareas) {
            const tareaDto = new ListTareaDTO();
            tareaDto.id = t.id;
            tareaDto.descripcion = t.descripcion;
            tareaDto.estado = t.estado;
            tareas.push(tareaDto);
        }

        dto.tareas = tareas;
        return dto;
    }

    async existeProyectoPorIdCliente(idCliente: number): Promise<boolean> {
        return await this.repository.exists({ 
            where: { 
                cliente: { id: idCliente }, 
                estado: In([EstadosProyectosEnum.ACTIVO, EstadosProyectosEnum.FINALIZADO]) 
            } 
        });
    }
}