// frontend/src/app/components/audit-history/audit-history.component.ts
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuditService } from '../../services/audit.service';

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

@Component({
  selector: 'app-audit-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audit-history-container">
      <div class="audit-header">
        <h5>
          <i class="fas fa-history me-2"></i>
          Historial de Cambios
        </h5>
        <span class="badge" [class.bg-primary]="totalItems > 0" [class.bg-secondary]="totalItems === 0">
          {{ totalItems }} cambios
        </span>
      </div>

      @if (loading) {
        <div class="text-center p-4">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2 text-muted small">Cargando historial...</p>
        </div>
      }

      @if (!loading && auditLogs.length === 0) {
        <div class="text-center p-4 text-muted">
          <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
          <p class="mb-0">No hay cambios registrados para este registro</p>
          <small class="d-block mt-1">Los cambios aparecerán aquí cuando se realicen operaciones</small>
        </div>
      }

      @if (!loading && auditLogs.length > 0) {
        <div class="audit-list">
          @for (log of auditLogs; track log.id) {
            <div class="audit-item">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="badge"
                        [class.bg-success]="log.action === 'CREATE'"
                        [class.bg-primary]="log.action === 'UPDATE'"
                        [class.bg-danger]="log.action === 'DELETE'">
                    <i [class]="getActionIcon(log.action)"></i>
                    {{ getActionText(log.action) }}
                  </span>
                  <span class="ms-2 text-muted">
                    <i class="fas fa-user me-1"></i>
                    {{ log.userEmail || 'Usuario' }}
                  </span>
                </div>
                <small class="text-muted">
                  <i class="far fa-clock me-1"></i>
                  {{ formatDate(log.createdAt) }}
                </small>
              </div>

              @if (log.action === 'UPDATE' && log.changes?.before && log.changes?.after) {
                <div class="audit-changes mt-2">
                  <small class="text-muted d-block mb-1">Cambios realizados:</small>
                  @for (key of getChangedFields(log.changes); track key) {
                    <div class="change-row">
                      <span class="field-name">{{ key }}:</span>
                      <span class="old-value">{{ getValue(log.changes.before[key]) }}</span>
                      <span class="arrow">→</span>
                      <span class="new-value">{{ getValue(log.changes.after[key]) }}</span>
                    </div>
                  }
                </div>
              }

              @if (log.action === 'CREATE' && log.changes?.after) {
                <div class="audit-changes mt-2">
                  <small class="text-success">
                    <i class="fas fa-plus-circle me-1"></i>
                    Registro creado
                  </small>
                </div>
              }

              @if (log.action === 'DELETE' && log.changes?.before) {
                <div class="audit-changes mt-2">
                  <small class="text-danger">
                    <i class="fas fa-trash-alt me-1"></i>
                    Registro eliminado
                  </small>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (totalPages > 1) {
        <div class="pagination-container mt-3">
          <nav>
            <ul class="pagination pagination-sm justify-content-center mb-0">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="changePage(currentPage - 1)">Anterior</button>
              </li>
              @for (page of getPages(); track page) {
                <li class="page-item" [class.active]="page === currentPage">
                  <button class="page-link" (click)="changePage(page)">{{ page }}</button>
                </li>
              }
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="changePage(currentPage + 1)">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      }
    </div>
  `,
  styles: [`
    .audit-history-container {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .audit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .audit-header h5 {
      margin: 0;
    }
    .audit-list {
      max-height: 400px;
      overflow-y: auto;
    }
    .audit-item {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .audit-item:last-child {
      border-bottom: none;
    }
    .audit-changes {
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .change-row {
      padding: 2px 0;
    }
    .field-name {
      font-weight: bold;
      color: #495057;
      margin-right: 5px;
    }
    .old-value {
      color: #dc3545;
      text-decoration: line-through;
      margin-right: 5px;
    }
    .arrow {
      margin: 0 5px;
      color: #6c757d;
    }
    .new-value {
      color: #28a745;
      font-weight: bold;
    }
    .badge {
      font-size: 0.75rem;
      padding: 4px 10px;
    }
    .pagination-container {
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class AuditHistoryComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() entityId: string = '';
  @Input() showFullHistory: boolean = true;

  private auditService = inject(AuditService);

  auditLogs: AuditLog[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  loading = false;
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🔍 [AUDIT HISTORY] Inicializando con:', {
      entityName: this.entityName,
      entityId: this.entityId
    });

    if (this.entityName && this.entityId) {
      this.loadHistory();
    } else {
      console.warn('⚠️ [AUDIT HISTORY] Falta entityName o entityId');
    }
  }

  loadHistory() {
    console.log('🔍 [AUDIT HISTORY] Cargando historial...');
    this.loading = true;
    const sub = this.auditService
      .getEntityHistory(this.entityName, this.entityId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('✅ [AUDIT HISTORY] Datos recibidos:', response);
          this.auditLogs = response.items;
          this.totalItems = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [AUDIT HISTORY] Error:', error);
          this.loading = false;
        }
      });
    this.subscriptions.push(sub);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHistory();
    }
  }

  getActionText(action: string): string {
    const actions: Record<string, string> = {
      'CREATE': 'Creación',
      'UPDATE': 'Actualización',
      'DELETE': 'Eliminación'
    };
    return actions[action] || action;
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      'CREATE': 'fas fa-plus-circle',
      'UPDATE': 'fas fa-edit',
      'DELETE': 'fas fa-trash-alt'
    };
    return icons[action] || 'fas fa-circle';
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

// frontend/src/app/components/audit-history/audit-history.component.ts

getChangedFields(changes: any): string[] {
  if (!changes || !changes.before || !changes.after) return [];

  // Obtenemos todas las llaves posibles combinando ambos estados
  const allKeys = Array.from(new Set([
    ...Object.keys(changes.before),
    ...Object.keys(changes.after)
  ]));

  return allKeys.filter(key => {
    // 1. Ignorar campos de control o de auditoría interna
    const ignoredFields = ['createdAt', 'updatedAt', 'id', 'id_cliente', 'fechaFin'];
    if (ignoredFields.includes(key)) return false;

    const beforeVal = changes.before[key];
    const afterVal = changes.after[key];

    // 2. Si uno de los dos es undefined o null de forma inconsistente
    if (beforeVal === undefined || afterVal === undefined) return true;

    // 3. Comparación estricta de strings/valores
    return JSON.stringify(beforeVal) !== JSON.stringify(afterVal);
  });
}

  getValue(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  getPages(): number[] {
    const pages: number[] = [];
    const total = Math.min(this.totalPages, 5);
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + total - 1);
    if (end - start + 1 < total) {
      start = Math.max(1, end - total + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
