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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
const core_1 = require("@nestjs/core");
let AuditInterceptor = class AuditInterceptor {
    auditService;
    reflector;
    constructor(auditService, reflector) {
        this.auditService = auditService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const entityName = this.reflector.get('entityName', context.getHandler());
        const action = this.reflector.get('action', context.getHandler());
        if (!entityName || !action || !user) {
            return next.handle();
        }
        const requestBodyCopy = req.body ? JSON.parse(JSON.stringify(req.body)) : null;
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                let entityId = req.params.id;
                if (action === 'CREATE' && response) {
                    entityId = String(response.id || response._id || 'unknown');
                }
                const changes = {
                    before: action === 'CREATE' ? null : requestBodyCopy,
                    after: action === 'DELETE' ? null : response,
                };
                await this.auditService.logChange(entityName, entityId || 'unknown', action, changes, user.id || user.sub, user.email || user.username || 'unknown', req);
            }
            catch (error) {
                console.error('❌ [INTERCEPTOR] Error al guardar auditoría:', error);
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        core_1.Reflector])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map