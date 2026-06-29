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
exports.ListProyectoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const estados_proyectos_enum_1 = require("../../enums/estados-proyectos.enum");
const list_cliente_dto_1 = require("./list-cliente.dto");
class ListProyectoDTO {
    id;
    nombre;
    estado;
    cliente;
}
exports.ListProyectoDTO = ListProyectoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListProyectoDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListProyectoDTO.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListProyectoDTO.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", list_cliente_dto_1.ListClienteDTO)
], ListProyectoDTO.prototype, "cliente", void 0);
//# sourceMappingURL=list-proyecto.dto.js.map