import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListTareaDTO } from "./list-tarea-dto";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import { ProgressBarModule } from 'primeng/progressbar';
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { NgClass } from '@angular/common';

@Component({
  selector: "app-tareas-listado",
  templateUrl: "./tareas-listado.html",
  styleUrls: ["./tareas-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionTarea, ProgressBarModule,NgClass ]
})

export class TareasListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);

  proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  tareas: Signal<ListTareaDTO[]> = computed(() => {
    return this.proyecto()?.tareas || [];

  });

  tareasFiltradas: Signal<ListTareaDTO[]> = computed(() => {

    const estado = this.filtroEstado();
  
    if (estado === 'TODAS') {
      return this.tareas();
    }
  
    return this.tareas().filter(
      tarea => tarea.estado === estado
    );
  
  });

  dialogVisible: WritableSignal<boolean> = signal(false);

  tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);
  
  filtroEstado: WritableSignal<string> = signal('TODAS');

  private readonly router: Router = inject(Router);

  readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refreshProyecto();
      }
    });
    this.idProyecto.set(Number(this.route.snapshot.paramMap.get('id')));

    if (this.idProyecto() === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de proyecto no válido' });
      this.router.navigateByUrl("/proyectos");
    }

  }

  ngOnInit(): void {
    this.refreshProyecto();
  }

  refreshProyecto(): void {
    this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
      next: (data) => {
        this.proyecto.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el proyecto' });
      }
    });
  }

  crearTarea(): void {
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.dialogVisible.set(true);
    this.tareaSeleccionada.set(tarea);
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

  readonly porcentajeAvance = computed(() => {

    const tareas = this.tareas();
  
    if (tareas.length === 0) {
      return 0;
    }
  
    const finalizadas = tareas.filter(
      tarea => tarea.estado === EstadosTareasEnum.FINALIZADA
    ).length;
  
    return Math.round((finalizadas / tareas.length) * 100);
  });

  readonly tareasFinalizadas = computed(() => {
    return this.tareas().filter(
      tarea => tarea.estado === EstadosTareasEnum.FINALIZADA
    ).length;
  });
  
  readonly tareasPendientes = computed(() => {
    return this.tareas().filter(
      tarea => tarea.estado === EstadosTareasEnum.PENDIENTE
    ).length;
  });
  
  readonly tareasKanbanPendientes = computed(() => {
    return this.tareas().filter(
      tarea => tarea.estado === EstadosTareasEnum.PENDIENTE
    );
  });
  
  readonly tareasKanbanFinalizadas = computed(() => {
    return this.tareas().filter(
      tarea => tarea.estado === EstadosTareasEnum.FINALIZADA
    );
  });
  
  readonly tareasKanbanBaja = computed(() => {
    return this.tareas().filter(
      tarea => tarea.estado === EstadosTareasEnum.BAJA
    );
  });

  cambiarFiltro(event: Event): void {

    const valor = (event.target as HTMLSelectElement).value;
  
    this.filtroEstado.set(valor);
  
  }
  

}