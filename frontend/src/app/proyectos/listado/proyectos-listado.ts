import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, DatePipe]
})

export class ProyectosListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);
  
  private readonly router = inject(Router);

  irDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);

  proyectosFiltrados: WritableSignal<ListProyectoDTO[]> = signal([]);

  estadoSeleccionado: string = '';

  textoBusqueda: string = '';

  dialogVisible: WritableSignal<boolean> = signal(false);

  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarProyectos();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {

        console.log(data);

        this.proyectos.set(data);
        this.proyectosFiltrados.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    window.open(`/proyectos/${proyecto.id}/tareas`, '_blank');
  }

  filtrarProyectos(event: Event): void {

    const texto = (event.target as HTMLInputElement)
      .value
      .toLowerCase();
  
    const resultado = this.proyectos().filter(proyecto =>
  
      proyecto.nombre
        .toLowerCase()
        .includes(texto)
  
      ||
  
      proyecto.cliente?.nombre
        .toLowerCase()
        .includes(texto)
  
    );
  
    this.proyectosFiltrados.set(resultado);
  
  }

  filtrarEstado(event: Event): void {

    this.estadoSeleccionado =
      (event.target as HTMLSelectElement).value;
  
    let resultado = this.proyectos();
  
    if (this.estadoSeleccionado) {
  
      resultado = resultado.filter(
        proyecto => proyecto.estado === this.estadoSeleccionado
      );
  
    }
  
    this.proyectosFiltrados.set(resultado);
  }

  aplicarFiltros(): void {

    let resultado = this.proyectos();
  
    if (this.textoBusqueda) {
  
      resultado = resultado.filter(proyecto =>
        proyecto.nombre
          .toLowerCase()
          .includes(this.textoBusqueda)
      );
  
    }
  
    if (this.estadoSeleccionado) {
  
      resultado = resultado.filter(proyecto =>
        proyecto.estado === this.estadoSeleccionado
      );
  
    }
  
    this.proyectosFiltrados.set(resultado);
  }



}