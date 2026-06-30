// tarea.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { Proyecto } from './proyecto.entity';

@Entity({ name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column()
  descripcion!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadosTareasEnum })
  estado!: EstadosTareasEnum;

  @Column({ name: 'id_proyecto' })
  idProyecto!: number;

  // 🔽 NUEVO: Relación con la tarea padre
  @Column({ name: 'tarea_padre_id', nullable: true })
  tareaPadreId!: number | null;

  @ManyToOne(() => Tarea, (tarea) => tarea.tareasHijas)
  @JoinColumn({ name: 'tarea_padre_id' })
  tareaPadre!: Tarea | null;

  // 🔽 NUEVO: Relación con las tareas hijas
  @OneToMany(() => Tarea, (tarea) => tarea.tareaPadre)
  tareasHijas!: Tarea[];

  // Relación existente con Proyecto
  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto!: Proyecto;
}