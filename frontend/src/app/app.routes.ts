import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { DashboardComponent } from './dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';
import { ClientesListado } from './proyectos/clientes/listado/clientes-listado';
import { RecuperarPasswordComponent } from './auth/recuperar-password/recuperar-password.component'; // <--- 1. IMPORTA AQUÍ
import { Register } from './auth/register/register';
import { AuditFullHistoryComponent } from './audit/audit-full-history.component';


export const routes: Routes = [

    {
      path: 'login',
      component: Login
    },
    {
        path: "registrar",
        component: Register
    },
    {
        path: "recuperar-password", // <--- 2. AGREGA LA RUTA AQUÍ
        component: RecuperarPasswordComponent
    },
    {
      path: '',
      component: MainLayout,

      children: [

        {
          path: 'dashboard',
          component: DashboardComponent
        },

        {
          path: 'proyectos',
          component: ProyectosListado
        },

        {
          path: 'clientes',
          component: ClientesListado
        },

        {
          path: 'proyectos/:id/tareas',
          component: TareasListado
        },

        {
          path: 'audit',
          component: AuditFullHistoryComponent
        }

      ]
    },

    {
      path: '**',
      redirectTo: 'login'
    }

  ];
