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
exports.Proyecto = void 0;
const typeorm_1 = require("typeorm");
const estados_proyectos_enum_1 = require("../enums/estados-proyectos.enum");
const cliente_entity_1 = require("./cliente.entity");
const tarea_entity_1 = require("./tarea.entity");
let Proyecto = class Proyecto {
    id;
    nombre;
    estado;
    idCliente;
    cliente;
    tareas;
};
exports.Proyecto = Proyecto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proyecto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proyecto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: estados_proyectos_enum_1.EstadosProyectosEnum }),
    __metadata("design:type", String)
], Proyecto.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cliente' }),
    __metadata("design:type", Number)
], Proyecto.prototype, "idCliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente),
    (0, typeorm_1.JoinColumn)({ name: 'id_cliente' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Proyecto.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tarea_entity_1.Tarea, (tarea) => tarea.proyecto),
    __metadata("design:type", Array)
], Proyecto.prototype, "tareas", void 0);
exports.Proyecto = Proyecto = __decorate([
    (0, typeorm_1.Entity)({ name: 'proyectos' })
], Proyecto);
//# sourceMappingURL=proyecto.entity.js.map