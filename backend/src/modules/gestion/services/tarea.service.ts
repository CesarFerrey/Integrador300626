import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarea } from "../entities/tarea.entity";
import { Repository } from "typeorm";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';

@Injectable()
export class TareasService {

    constructor(
        @InjectRepository(Tarea) private readonly tareasRepository: Repository<Tarea>,
        private readonly auditService: AuditService, // ← Agregar AuditService
    ) {}

    async crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{ id: number }> {
        const tarea: Tarea = this.tareasRepository.create(dto);
        tarea.estado = EstadosTareasEnum.PENDIENTE;
        tarea.idProyecto = idProyecto;
        await this.tareasRepository.save(tarea);
        return { id: tarea.id };
    }

    // Nuevo método con auditoría
    async crearTareaConAuditoria(
        dto: CreateTareaDto,
        idProyecto: number,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<{ id: number }> {
        const resultado = await this.crearTarea(dto, idProyecto);
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Tarea',
                String(resultado.id),
                'CREATE',
                { after: { ...dto, idProyecto } },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría CREATE registrada para tarea:', resultado.id);
        }
        
        return resultado;
    }

    async actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void> {
        const tarea: Tarea | null = await this.tareasRepository.findOne({ where: { id: idTarea } });

        if (!tarea) {
            throw new BadRequestException("La tarea indicada no existe");
        }

        this.tareasRepository.merge(tarea, dto);
        await this.tareasRepository.save(tarea);
    }

    // Nuevo método con auditoría
    async actualizarTareaConAuditoria(
        dto: UpdateTareaDto,
        idTarea: number,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<void> {
        // Obtener estado antes
        const before = await this.tareasRepository.findOne({ where: { id: idTarea } });
        
        await this.actualizarTarea(dto, idTarea);
        
        // Obtener estado después
        const after = await this.tareasRepository.findOne({ where: { id: idTarea } });
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Tarea',
                String(idTarea),
                'UPDATE',
                { before, after },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría UPDATE registrada para tarea:', idTarea);
        }
    }

    async eliminarTareaConAuditoria(
        idTarea: number,
        userId?: string,
        userEmail?: string,
        req?: Request
    ): Promise<void> {
        // Obtener estado antes
        const before = await this.tareasRepository.findOne({ where: { id: idTarea } });
        
        if (!before) {
            throw new BadRequestException("La tarea indicada no existe");
        }
        
        await this.tareasRepository.delete(idTarea);
        
        if (userId && userEmail) {
            await this.auditService.logChange(
                'Tarea',
                String(idTarea),
                'DELETE',
                { before },
                userId,
                userEmail,
                req,
            );
            console.log('✅ Auditoría DELETE registrada para tarea:', idTarea);
        }
    }
}