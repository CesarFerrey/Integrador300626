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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const create_cliente_dto_1 = require("../dtos/input/create-cliente.dto");
const swagger_1 = require("@nestjs/swagger");
const list_cliente_dto_1 = require("../dtos/output/list-cliente.dto");
const update_cliente_dto_1 = require("../dtos/input/update-cliente.dto");
const estados_clientes_enum_1 = require("../enums/estados-clientes.enum");
const clientes_service_1 = require("../services/clientes.service");
const audit_interceptor_1 = require("../../../audit/audit.interceptor");
const audit_decorador_1 = require("../../../audit/audit.decorador");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let ClientesController = class ClientesController {
    clientesService;
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    async crearCliente(dto, req) {
        const user = req.user;
        console.log('👤 Creando cliente - Usuario:', user?.email);
        return await this.clientesService.crearClienteConAuditoria(dto, user?.id || user?.sub, user?.email || user?.username, req);
    }
    async actualizarCliente(id, dto, req) {
        const user = req.user;
        console.log('👤 Actualizando cliente - Usuario:', user?.email);
        await this.clientesService.actualizarClienteConAuditoria(id, dto, user?.id || user?.sub, user?.email || user?.username, req);
    }
    async eliminarCliente(id, req) {
        const user = req.user;
        console.log('👤 Eliminando cliente - Usuario:', user?.email);
        await this.clientesService.eliminarClienteConAuditoria(id, user?.id || user?.sub, user?.email || user?.username, req);
        return { message: 'Cliente eliminado correctamente' };
    }
    async obtenerClientes(estado) {
        return await this.clientesService.obtenerClientes(estado);
    }
    async obtenerCliente(id) {
        return await this.clientesService.obtenerCliente(id);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, audit_decorador_1.Audit)('Cliente', 'CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "crearCliente", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':id'),
    (0, audit_decorador_1.Audit)('Cliente', 'UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "actualizarCliente", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, audit_decorador_1.Audit)('Cliente', 'DELETE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "eliminarCliente", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: list_cliente_dto_1.ListClienteDTO, isArray: true }),
    (0, swagger_1.ApiQuery)({
        name: 'estado',
        required: false,
        enum: estados_clientes_enum_1.EstadosClientesEnum,
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "obtenerClientes", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesController.prototype, "obtenerCliente", null);
exports.ClientesController = ClientesController = __decorate([
    (0, swagger_1.ApiTags)('Clientes'),
    (0, common_1.Controller)('clientes'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map