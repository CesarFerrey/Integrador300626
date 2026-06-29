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
exports.UpdateProyectoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_proyecto_dto_1 = require("./create-proyecto.dto");
const class_validator_1 = require("class-validator");
const estados_proyectos_enum_1 = require("../../enums/estados-proyectos.enum");
class UpdateProyectoDto extends (0, swagger_1.PartialType)(create_proyecto_dto_1.CreateProyectoDto) {
    estado;
}
exports.UpdateProyectoDto = UpdateProyectoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: estados_proyectos_enum_1.EstadosProyectosEnum,
        example: estados_proyectos_enum_1.EstadosProyectosEnum.ACTIVO
    }),
    (0, class_validator_1.IsEnum)(estados_proyectos_enum_1.EstadosProyectosEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProyectoDto.prototype, "estado", void 0);
//# sourceMappingURL=update-proyecto.dto.js.map