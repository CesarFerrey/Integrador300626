import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { ClientesListadoApiClient } from "./clientes-listado-api-client";
import { ListClienteDTO } from "./list-cliente-dto";
import { DialogModule } from "primeng/dialog";
import { GestionCliente } from "../gestion/gestion-cliente";
//import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: "app-clientes-listado",
  standalone: true,
  templateUrl: "./clientes-listado.html",
  styleUrls: ["./clientes-listado.css"],
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    GestionCliente,
    //TagModule,
    TooltipModule,
  ]
  
})

export class ClientesListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  visible: ModelSignal<boolean> = model(false);

  private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

  clientes: WritableSignal<ListClienteDTO[]> = signal([]);

  clientesFiltrados: WritableSignal<ListClienteDTO[]> = signal([]);

  estadoSeleccionado: string = '';

  textoBusqueda: string = '';

  dialogVisible: WritableSignal<boolean> = signal(false);

  clienteSeleccionado: WritableSignal<ListClienteDTO | null> = signal<ListClienteDTO | null>(null);

  getEstadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (estado) {
        case 'ACTIVO':
            return 'success';

        case 'BAJA':
            return 'danger';

        case 'PENDIENTE':
            return 'warn';

        default:
            return 'info';
    }
}

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    console.log('ClientesListado cargado');
    this.refrescarClientes();
  }


  refrescarClientes(): void {

    console.log('Entró a refrescarClientes');
  
    this.clientesListadoApiClient.buscarClientes().subscribe({
      next: (data) => {
        console.log('CLIENTES RECIBIDOS:', data);
        this.clientes.set(data);
        this.clientesFiltrados.set(data);
      },
      error: (error) => {
        console.error('ERROR:', error);
      }
    });
  
  }

  crearCliente(): void {
    this.dialogVisible.set(true);
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.dialogVisible.set(true);
    this.clienteSeleccionado.set(cliente);
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

  filtrarClientes(event: Event): void {

    this.textoBusqueda = (event.target as HTMLInputElement)
      .value
      .toLowerCase();
  
    this.aplicarFiltros();
  
  }
  
  filtrarEstado(event: Event): void {
  
    this.estadoSeleccionado =
      (event.target as HTMLSelectElement).value;
  
    this.aplicarFiltros();
  
  }
  
  aplicarFiltros(): void {
  
    let resultado = this.clientes();
  
    if (this.textoBusqueda) {
  
      resultado = resultado.filter(cliente =>
  
        cliente.nombre
          .toLowerCase()
          .includes(this.textoBusqueda)
  
        ||
  
        cliente.email
          .toLowerCase()
          .includes(this.textoBusqueda)
  
      );
  
    }
  
    if (this.estadoSeleccionado) {
  
      resultado = resultado.filter(cliente =>
        cliente.estado === this.estadoSeleccionado
      );
  
    }
  
    this.clientesFiltrados.set(resultado);
  
  }

}