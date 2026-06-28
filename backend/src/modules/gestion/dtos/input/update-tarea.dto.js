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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTareaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const estados_tareas_enum_1 = require("../../enums/estados-tareas.enum");
const create_tarea_dto_1 = require("./create-tarea.dto");
class UpdateTareaDto extends (0, swagger_1.PartialType)(create_tarea_dto_1.CreateTareaDto) {
    estado;
}
exports.UpdateTareaDto = UpdateTareaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: estados_tareas_enum_1.EstadosTareasEnum, example: estados_tareas_enum_1.EstadosTareasEnum.PENDIENTE }),
    (0, class_validator_1.IsEnum)(estados_tareas_enum_1.EstadosTareasEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTareaDto.prototype, "estado", void 0);
//# sourceMappingURL=update-tarea.dto.js.map