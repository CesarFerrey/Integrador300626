// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Request } from 'express';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logChange(
    entityName: string,
    entityId: string,
    action: string,
    changes: any,
    userId: string,
    userEmail: string,
    req?: Request,
  ) {
    const auditLog = this.auditRepository.create({
      entityName,
      entityId,
      action,
      changes,
      userId,
      userEmail,
      userIp: req?.ip || req?.connection?.remoteAddress,
    });

    return await this.auditRepository.save(auditLog);
  }

  async getHistory(
    entityName: string,
    entityId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const [items, total] = await this.auditRepository.findAndCount({
      where: { entityName, entityId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRecentActivity(limit: number = 50) {
    return await this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAllHistory(page: number = 1, limit: number = 20) {
    const [items, total] = await this.auditRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}