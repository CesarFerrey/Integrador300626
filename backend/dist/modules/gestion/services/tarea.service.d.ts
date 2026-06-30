import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { Tarea } from "../entities/tarea.entity";
import { Repository } from "typeorm";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';
export declare class TareasService {
    private readonly tareasRepository;
    private readonly auditService;
    constructor(tareasRepository: Repository<Tarea>, auditService: AuditService);
    crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{
        id: number;
    }>;
    crearTareaConAuditoria(dto: CreateTareaDto, idProyecto: number, userId?: string, userEmail?: string, req?: Request): Promise<{
        id: number;
    }>;
    actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void>;
    actualizarTareaConAuditoria(dto: UpdateTareaDto, idTarea: number, userId?: string, userEmail?: string, req?: Request): Promise<void>;
    eliminarTareaConAuditoria(idTarea: number, userId?: string, userEmail?: string, req?: Request): Promise<void>;
}
