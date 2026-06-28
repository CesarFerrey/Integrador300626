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
exports.TareasController = void 0;
const common_1 = require("@nestjs/common");
const update_tarea_dto_1 = require("../dtos/input/update-tarea.dto");
const create_tarea_dto_1 = require("../dtos/input/create-tarea.dto");
const swagger_1 = require("@nestjs/swagger");
const tarea_service_1 = require("../services/tarea.service");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let TareasController = class TareasController {
    tareasService;
    constructor(tareasService) {
        this.tareasService = tareasService;
    }
    async crearTarea(dto, idProyecto) {
        return await this.tareasService.crearTarea(dto, idProyecto);
    }
    async actualizarTarea(dto, id) {
        await this.tareasService.actualizarTarea(dto, id);
    }
};
exports.TareasController = TareasController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('idProyecto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tarea_dto_1.CreateTareaDto, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "crearTarea", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_tarea_dto_1.UpdateTareaDto, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "actualizarTarea", null);
exports.TareasController = TareasController = __decorate([
    (0, common_1.Controller)('proyectos/:idProyecto/tareas'),
    __metadata("design:paramtypes", [tarea_service_1.TareasService])
], TareasController);
//# sourceMappingURL=tareas.controller.js.map