// frontend/src/app/services/audit.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog, AuditLogResponse } from '../components/audit-history/audit-history.component';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = '/api/audit'; // Asegúrate que esta URL sea correcta

  getEntityHistory(
    entityName: string,
    entityId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<AuditLogResponse> {
    console.log('🔍 [AUDIT SERVICE] Solicitando historial:', { entityName, entityId, page, limit });
    return this.http.get<AuditLogResponse>(
      `${this.apiUrl}/entity/${entityName}/${entityId}`,
      { params: { page: page.toString(), limit: limit.toString() } }
    );
  }

  getRecentActivity(limit: number = 50): Observable<AuditLog[]> {
    console.log('🔍 [AUDIT SERVICE] Solicitando actividad reciente:', { limit });
    return this.http.get<AuditLog[]>(
      `${this.apiUrl}/recent`,
      { params: { limit: limit.toString() } }
    );
  }
}
