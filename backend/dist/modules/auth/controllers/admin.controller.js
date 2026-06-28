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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("../services/usuarios.service");
let AdminController = class AdminController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async buscarUsuarios(criterio) {
        return await this.usuariosService.buscarUsuariosFiltrados(criterio);
    }
    async activarUsuario(id) {
        await this.usuariosService.activarUsuario(id);
        return;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('buscar'),
    __param(0, (0, common_1.Query)('criterio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "buscarUsuarios", null);
__decorate([
    (0, common_1.Put)(':id/activar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "activarUsuario", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin/usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map