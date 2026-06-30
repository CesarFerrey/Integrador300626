import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    getAllHistory(page?: string, limit?: string): Promise<{
        items: import("./entities/audit-log.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEntityHistory(entityName: string, entityId: string, page?: string, limit?: string): Promise<{
        items: import("./entities/audit-log.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentActivity(limit?: string): Promise<import("./entities/audit-log.entity").AuditLog[]>;
}
