"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestionModule = void 0;
const common_1 = require("@nestjs/common");
const clientes_controller_1 = require("./controllers/clientes.controller");
const proyectos_controller_1 = require("./controllers/proyectos.controller");
const tareas_controller_1 = require("./controllers/tareas.controller");
const typeorm_1 = require("@nestjs/typeorm");
const tarea_entity_1 = require("./entities/tarea.entity");
const cliente_entity_1 = require("./entities/cliente.entity");
const proyecto_entity_1 = require("./entities/proyecto.entity");
const tarea_service_1 = require("./services/tarea.service");
const auth_module_1 = require("../auth/auth.module");
const clientes_service_1 = require("./services/clientes.service");
const proyectos_service_1 = require("./services/proyectos.service");
let GestionModule = class GestionModule {
};
exports.GestionModule = GestionModule;
exports.GestionModule = GestionModule = __decorate([
    (0, common_1.Module)({
        controllers: [clientes_controller_1.ClientesController, proyectos_controller_1.ProyectosController, tareas_controller_1.TareasController],
        providers: [tarea_service_1.TareasService, clientes_service_1.ClientesService, proyectos_service_1.ProyectosService],
        exports: [],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tarea_entity_1.Tarea, cliente_entity_1.Cliente, proyecto_entity_1.Proyecto]),
            auth_module_1.AuthModule
        ]
    })
], GestionModule);
//# sourceMappingURL=gestion.module.js.map