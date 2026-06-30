"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tarea_entity_1 = require("../entities/tarea.entity");
const typeorm_2 = require("typeorm");
const estados_tareas_enum_1 = require("../enums/estados-tareas.enum");
const audit_service_1 = require("../../../audit/audit.service");
let TareasService = class TareasService {
    tareasRepository;
    auditService;
    constructor(tareasRepository, auditService) {
        this.tareasRepository = tareasRepository;
        this.auditService = auditService;
    }
    async crearTarea(dto, idProyecto) {
        const tarea = this.tareasRepository.create(dto);
        tarea.estado = estados_tareas_enum_1.EstadosTareasEnum.PENDIENTE;
        tarea.idProyecto = idProyecto;
        await this.tareasRepository.save(tarea);
        return { id: tarea.id };
    }
    async crearTareaConAuditoria(dto, idProyecto, userId, userEmail, req) {
        const resultado = await this.crearTarea(dto, idProyecto);
        if (userId && userEmail) {
            await this.auditService.logChange('Tarea', String(resultado.id), 'CREATE', { after: { ...dto, idProyecto } }, userId, userEmail, req);
            console.log('✅ Auditoría CREATE registrada para tarea:', resultado.id);
        }
        return resultado;
    }
    async actualizarTarea(dto, idTarea) {
        const tarea = await this.tareasRepository.findOne({ where: { id: idTarea } });
        if (!tarea) {
            throw new common_1.BadRequestException("La tarea indicada no existe");
        }
        this.tareasRepository.merge(tarea, dto);
        await this.tareasRepository.save(tarea);
    }
    async actualizarTareaConAuditoria(dto, idTarea, userId, userEmail, req) {
        const before = await this.tareasRepository.findOne({ where: { id: idTarea } });
        await this.actualizarTarea(dto, idTarea);
        const after = await this.tareasRepository.findOne({ where: { id: idTarea } });
        if (userId && userEmail) {
            await this.auditService.logChange('Tarea', String(idTarea), 'UPDATE', { before, after }, userId, userEmail, req);
            console.log('✅ Auditoría UPDATE registrada para tarea:', idTarea);
        }
    }
    async eliminarTareaConAuditoria(idTarea, userId, userEmail, req) {
        const before = await this.tareasRepository.findOne({ where: { id: idTarea } });
        if (!before) {
            throw new common_1.BadRequestException("La tarea indicada no existe");
        }
        await this.tareasRepository.delete(idTarea);
        if (userId && userEmail) {
            await this.auditService.logChange('Tarea', String(idTarea), 'DELETE', { before }, userId, userEmail, req);
            console.log('✅ Auditoría DELETE registrada para tarea:', idTarea);
        }
    }
};
exports.TareasService = TareasService;
exports.TareasService = TareasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tarea_entity_1.Tarea)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], TareasService);
//# sourceMappingURL=tarea.service.js.map