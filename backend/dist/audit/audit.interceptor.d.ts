import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';
export declare class AuditInterceptor implements NestInterceptor {
    private auditService;
    private reflector;
    constructor(auditService: AuditService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
