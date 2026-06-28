
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProyectosListadoApiClient } from '../proyectos/listado/proyectos-listado-api-client';
import { ListProyectoDTO } from '../proyectos/listado/list-proyecto-dto';
import { Chart, registerables } from 'chart.js';
import { ClientesListadoApiClient } from '../proyectos/clientes/listado/clientes-listado-api-client';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
 
})

export class DashboardComponent implements OnInit {

  private graficoEstados: Chart | null = null;
  private graficoClientes: Chart | null = null;
  private readonly api = inject(ProyectosListadoApiClient);
  private readonly clientesApi = inject(ClientesListadoApiClient);

  proyectos: ListProyectoDTO[] = [];

  totalProyectos = signal(0);
  proyectosActivos = signal(0);
  proyectosFinalizados = signal(0);
  proyectosBaja = signal(0);
  clientesTotales = signal(0);
  fechaActualizacion = new Date().toLocaleString('es-AR');

  ngOnInit(): void {

    Chart.register(...registerables);
  
    this.cargarDatos();
    this.cargarClientes();
  
  }

  private cargarClientes(): void {

    this.clientesApi.buscarClientes().subscribe({
  
      next: (clientes) => {
  
        this.clientesTotales.set(
          clientes.length
        );
  
      }
  
    });
  
  }

  cargarDatos(): void {

    this.api.buscarProyectos().subscribe({

      next: (proyectos: ListProyectoDTO[]) => {

        this.proyectos = proyectos;
      
        this.totalProyectos.set(proyectos.length);
      
        this.proyectosActivos.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'ACTIVO'
          ).length
        );
      
        this.proyectosFinalizados.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'FINALIZADO'
          ).length
        );
      
        this.proyectosBaja.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'BAJA'
          ).length
        );
      
      
        // GRÁFICOS
      
        const activos = proyectos.filter(
          p => p.estado === 'ACTIVO'
        ).length;
      
        const finalizados = proyectos.filter(
          p => p.estado === 'FINALIZADO'
        ).length;
      
        const baja = proyectos.filter(
          p => p.estado === 'BAJA'
        ).length;
      
        this.crearGraficoEstados(
          activos,
          finalizados,
          baja
        );
        
        this.crearGraficoClientes();
        
        } 
        
        }); 
      } 

  exportarCSV(): void {

    const encabezados = [
      'ID',
      'Proyecto',
      'Estado',
      'Cliente'
    ];
  
    const filas = this.proyectos.map(p => [
      p.id,
      p.nombre,
      p.estado,
      p.cliente?.nombre ?? 'Sin cliente'
    ]);
  
    const csv = [
      encabezados.join(','),
      ...filas.map(f => f.join(','))
    ].join('\n');
  
    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8;' }
    );
  
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'proyectos.csv';
    link.click();
  
    window.URL.revokeObjectURL(url);
  }

  private crearGraficoClientes(): void {

    const proyectosPorCliente: Record<string, number> = {};
  
    this.proyectos.forEach(proyecto => {

      if (!proyecto.cliente) {
        return;
      }
    
      const cliente = proyecto.cliente.nombre;
    
      proyectosPorCliente[cliente] =
        (proyectosPorCliente[cliente] || 0) + 1;
    });
  
    const labels = Object.keys(proyectosPorCliente);
    const data = Object.values(proyectosPorCliente);
  
    if (this.graficoClientes) {
      this.graficoClientes.destroy();
    }
  
    this.graficoClientes = new Chart('graficoClientes', {
  
      type: 'bar',
  
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de proyectos',
          data: data
        }]
      },
  
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Proyectos por Cliente'
          }
        }
      }
  
    });
  
  }


  private crearGraficoEstados(
    activos: number,
    finalizados: number,
    baja: number
  ): void {
  
    if (this.graficoEstados) {
      this.graficoEstados.destroy();
    }
  
    this.graficoEstados = new Chart('graficoEstados', {
      type: 'doughnut',
  
      data: {
        labels: ['Activos', 'Finalizados', 'Baja'],
        datasets: [{
          data: [activos, finalizados, baja]
        }]
      },
  
      options: {
        responsive: true,
        maintainAspectRatio: false,
      
        cutout: '65%'
      }

    });
  
  }

  porcentajeActivos(): number {

    if (this.totalProyectos() === 0) {
      return 0;
    }
  
    return Math.round(
      (this.proyectosActivos() * 100) /
      this.totalProyectos()
    );
  
  }

  porcentajeFinalizados(): number {

    if (this.totalProyectos() === 0) {
      return 0;
    }
  
    return Math.round(
      (this.proyectosFinalizados() * 100) /
      this.totalProyectos()
    );
  
  }
  
  porcentajeBaja(): number {
  
    if (this.totalProyectos() === 0) {
      return 0;
    }
  
    return Math.round(
      (this.proyectosBaja() * 100) /
      this.totalProyectos()
    );
  
  }

  proximosVencimientos(): ListProyectoDTO[] {

    return [...this.proyectos]
  
      .filter(proyecto => proyecto.fechaFin)
  
      .sort((a, b) =>
        new Date(a.fechaFin!).getTime() -
        new Date(b.fechaFin!).getTime()
      )
  
      .slice(0, 3);
  
  }

}
