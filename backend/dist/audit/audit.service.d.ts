import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Request } from 'express';
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    logChange(entityName: string, entityId: string, action: string, changes: any, userId: string, userEmail: string, req?: Request): Promise<AuditLog>;
    getHistory(entityName: string, entityId: string, page?: number, limit?: number): Promise<{
        items: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecentActivity(limit?: number): Promise<AuditLog[]>;
    getAllHistory(page?: number, limit?: number): Promise<{
        items: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
