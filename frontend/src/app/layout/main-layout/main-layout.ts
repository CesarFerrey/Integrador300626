// frontend/src/app/layout/main-layout/main-layout.ts
import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../auth/auth-store';
import { AuditService } from '../../services/audit.service';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../../components/audit-history/audit-history.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private readonly authStore = inject(AuthStore);
  private auditService = inject(AuditService);

  // Estado del panel de auditoría
  showAuditPanel = signal(false);

  // Cambios recientes
  recentChanges = signal<AuditLog[]>([]);
  loadingRecent = signal(false);
  unreadCount = signal(0);

  // Email del usuario (si lo tienes en otro lado, lo puedes obtener)
  // Por ahora lo dejamos como null
  userEmail = signal<string | null>(null);

  ngOnInit() {
    this.loadRecentChanges();

    // Actualizar cada 30 segundos
    setInterval(() => {
      this.loadRecentChanges();
    }, 30000);
  }

  toggleAuditPanel() {
    this.showAuditPanel.update(value => !value);
    if (this.showAuditPanel()) {
      this.loadRecentChanges();
      this.unreadCount.set(0);
    }
  }

  loadRecentChanges() {
    this.loadingRecent.set(true);
    this.auditService.getRecentActivity(15).subscribe({
      next: (changes) => {
        const oldCount = this.recentChanges().length;
        this.recentChanges.set(changes);
        if (!this.showAuditPanel() && changes.length > oldCount) {
          this.unreadCount.update(count => count + (changes.length - oldCount));
        }
        this.loadingRecent.set(false);
      },
      error: (error) => {
        console.error('Error loading recent changes:', error);
        this.loadingRecent.set(false);
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showAuditPanel()) {
      this.showAuditPanel.set(false);
    }
  }

  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }

  getEntityName(entityName: string): string {
    const names: Record<string, string> = {
      'User': 'Usuario',
      'Project': 'Proyecto',
      'Client': 'Cliente',
      'Task': 'Tarea',
    };
    return names[entityName] || entityName;
  }

  getActionText(action: string): string {
    const actions: Record<string, string> = {
      'CREATE': 'Creó',
      'UPDATE': 'Actualizó',
      'DELETE': 'Eliminó'
    };
    return actions[action] || action;
  }

  getActionBadgeClass(action: string): string {
    const classes: Record<string, string> = {
      'CREATE': 'badge-success',
      'UPDATE': 'badge-primary',
      'DELETE': 'badge-danger'
    };
    return classes[action] || 'badge-secondary';
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;

    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getChangedFields(changes: any): string[] {
    if (!changes || !changes.before || !changes.after) return [];
    return Object.keys(changes.before).filter(key =>
      changes.before[key] !== changes.after[key]
    );
  }
}
