// proyecto.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { Cliente } from './cliente.entity';
import { Tarea } from './tarea.entity';

@Entity({ name: 'proyectos' })
export class Proyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ type: 'enum', enum: EstadosProyectosEnum })
  estado!: EstadosProyectosEnum;

  @Column({ name: 'id_cliente', nullable: true })
  idCliente!: number;

  // 🔽 NUEVO: Relación con el proyecto padre
  @Column({ name: 'proyecto_padre_id', nullable: true })
  proyectoPadreId!: number | null;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.proyectosHijos)
  @JoinColumn({ name: 'proyecto_padre_id' })
  proyectoPadre!: Proyecto | null;

  // 🔽 NUEVO: Relación con los proyectos hijos
  @OneToMany(() => Proyecto, (proyecto) => proyecto.proyectoPadre)
  proyectosHijos!: Proyecto[];

  // Relación existente con Cliente
  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  // Relación existente con Tareas
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas!: Tarea[];
}