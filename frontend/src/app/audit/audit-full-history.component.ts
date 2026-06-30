import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../models/audit-log.model';

@Component({
  selector: 'app-audit-full-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './audit-full-history.component.html',
  styleUrl: './audit-full-history.component.css',
})
export class AuditFullHistoryComponent implements OnInit {
  private readonly auditService = inject(AuditService);

  loading = false;
  logs: AuditLog[] = [];
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;

    this.auditService.getAllHistory(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.logs = response.items;
        this.totalPages = response.totalPages;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar historial completo:', error);
        this.loading = false;
      },
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadHistory();
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 7;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getActionText(action: string): string {
    const actions: Record<string, string> = {
      CREATE: 'Creación',
      UPDATE: 'Actualización',
      DELETE: 'Eliminación',
    };
    return actions[action] || action;
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      CREATE: 'fas fa-plus-circle',
      UPDATE: 'fas fa-edit',
      DELETE: 'fas fa-trash-alt',
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
      minute: '2-digit',
      second: '2-digit',
    });
  }

  getEntityName(entityName: string): string {
    const names: Record<string, string> = {
      User: 'Usuario',
      Usuario: 'Usuario',
      Project: 'Proyecto',
      Proyecto: 'Proyecto',
      Client: 'Cliente',
      Cliente: 'Cliente',
      Task: 'Tarea',
      Tarea: 'Tarea',
    };
    return names[entityName] || entityName;
  }

  getChangedFields(changes: any): string[] {
    if (!changes || !changes.before || !changes.after) return [];

    const allKeys = Array.from(
      new Set([...Object.keys(changes.before), ...Object.keys(changes.after)]),
    );

    return allKeys.filter((key) => {
      const ignoredFields = ['createdAt', 'updatedAt', 'id'];
      if (ignoredFields.includes(key)) return false;

      return JSON.stringify(changes.before[key]) !== JSON.stringify(changes.after[key]);
    });
  }

  getValue(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
