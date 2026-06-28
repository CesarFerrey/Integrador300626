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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("../../auth/services/usuarios.service");
const swagger_1 = require("@nestjs/swagger");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async findAll(nombre) {
        return await this.usuariosService.buscarUsuariosFiltrados(nombre || '');
    }
    async cambiarPassword(id, nuevaClave) {
        await this.usuariosService.cambiarPassword(id, nuevaClave);
        return { message: 'Contraseña actualizada correctamente' };
    }
    async recuperarPassword(body) {
        try {
            return await this.usuariosService.recuperarPassword(body.email, body.nuevaClave);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            throw new common_1.NotFoundException('Error al recuperar la contraseña');
        }
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'nombre', required: false }),
    __param(0, (0, common_1.Query)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/password'),
    (0, swagger_1.ApiBody)({
        schema: { type: 'object', properties: { nuevaClave: { type: 'string' } } },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('nuevaClave')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "cambiarPassword", null);
__decorate([
    (0, common_1.Patch)('recuperar'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                nuevaClave: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "recuperarPassword", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('Usuarios'),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map