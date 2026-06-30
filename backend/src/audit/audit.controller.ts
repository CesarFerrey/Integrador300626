// backend/src/audit/audit.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../modules/auth/guards/auth.guard';

@Controller('audit')
@UseGuards(AuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('entity/:entityName/:entityId')
  async getEntityHistory(
    @Param('entityName') entityName: string,
    @Param('entityId') entityId: string,
    @Query('page') page?: string,   // Lo recibimos como string primero
    @Query('limit') limit?: string, // Lo recibimos como string primero
  ) {
    // Convertimos explícitamente a enteros con base 10 para evitar problemas de tipos
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    console.log('🔍 [AUDIT CONTROLLER] getEntityHistory:', { 
      entityName, 
      entityId, 
      page: pageNumber, 
      limit: limitNumber 
    });

    return this.auditService.getHistory(
      entityName,
      entityId,
      pageNumber,
      limitNumber,
    );
  }

  @Get('recent')
  async getRecentActivity(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    
    console.log('🔍 [AUDIT CONTROLLER] getRecentActivity:', { limit: limitNumber });
    return this.auditService.getRecentActivity(limitNumber);
  }
}