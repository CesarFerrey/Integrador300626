// frontend/src/app/components/audit-history/audit-history.component.ts
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuditService } from '../../services/audit.service';
import { AuditLog } from '../../models/audit-log.model';

@Component({
  selector: 'app-audit-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-history.component.html',
  styleUrl: './audit-history.component.css'
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
