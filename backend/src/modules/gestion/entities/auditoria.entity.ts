import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('auditoria') // Nombre de la tabla en la BD
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  entidad: string; // Ejemplo: 'Usuario'

  @Column()
  entidadId: number; // El ID del registro que cambió

  @Column({ length: 20 })
  accion: string; // Ejemplo: 'UPDATE', 'DELETE', 'CREATE'

  @Column('text')
  detalle: string; // Descripción del cambio, ej: 'Nombre cambiado a Noe'

  @CreateDateColumn()
  fecha: Date; // Fecha automática de creación
}
