// src/audit/entities/audit-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    @Index()
    entityName!: string; // Nombre de la entidad (ej: 'User', 'Product')

  @Column()
    @Index()
    entityId!: string; // ID del registro afectado

  @Column()
    @Index()
    action!: string; // 'CREATE', 'UPDATE', 'DELETE'

  @Column('jsonb')
    changes!: {
        before?: any;
        after?: any;
        fields?: string[];
    };

  @Column()
    @Index()
    userId!: string; // ID del usuario que hizo el cambio

  @Column({ nullable: true })
  userEmail: string;

  @Column({ nullable: true })
  userIp: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}