// src/app/models/audit-log.model.ts
export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: {
    before?: any;
    after?: any;
    fields?: string[];
  };
  userId: string;
  userEmail: string;
  userIp: string;
  createdAt: Date;
}

export interface AuditLogResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
