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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const auth_guard_1 = require("../modules/auth/guards/auth.guard");
let AuditController = class AuditController {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAllHistory(page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;
        return this.auditService.getAllHistory(pageNumber, limitNumber);
    }
    async getEntityHistory(entityName, entityId, page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        console.log('🔍 [AUDIT CONTROLLER] getEntityHistory:', {
            entityName,
            entityId,
            page: pageNumber,
            limit: limitNumber
        });
        return this.auditService.getHistory(entityName, entityId, pageNumber, limitNumber);
    }
    async getRecentActivity(limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 50;
        console.log('🔍 [AUDIT CONTROLLER] getRecentActivity:', { limit: limitNumber });
        return this.auditService.getRecentActivity(limitNumber);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAllHistory", null);
__decorate([
    (0, common_1.Get)('entity/:entityName/:entityId'),
    __param(0, (0, common_1.Param)('entityName')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getEntityHistory", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getRecentActivity", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('audit'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map