// backend/src/audit/audit.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const entityName = this.reflector.get<string>('entityName', context.getHandler());
    const action = this.reflector.get<string>('action', context.getHandler());

    if (!entityName || !action || !user) {
      return next.handle();
    }

    // Copia profunda preventiva del body entrante para el estado previo/cambios
    const requestBodyCopy = req.body ? JSON.parse(JSON.stringify(req.body)) : null;

    return next.handle().pipe(
      tap(async (response) => {
        try {
          let entityId = req.params.id;
          
          if (action === 'CREATE' && response) {
            entityId = String(response.id || response._id || 'unknown');
          }

          const changes = {
            before: action === 'CREATE' ? null : requestBodyCopy,
            after: action === 'DELETE' ? null : response,
          };

          await this.auditService.logChange(
            entityName,
            entityId || 'unknown',
            action,
            changes,
            user.id || user.sub,
            user.email || user.username || 'unknown',
            req,
          );
        } catch (error) {
          console.error('❌ [INTERCEPTOR] Error al guardar auditoría:', error);
        }
      }),
    );
  }
}