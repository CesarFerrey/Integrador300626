import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { RecuperarPasswordComponent } from './auth/recuperar-password/recuperar-password.component'; // <--- 1. IMPORTA AQUÍ
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: "login",
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
        path: 'proyectos/:id/tareas',
        component: TareasListado,
    },
    {
        path: 'proyectos',
        component: ProyectosListado,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "proyectos"
    }
];