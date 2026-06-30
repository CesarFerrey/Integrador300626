import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../../audit/audit.module'; // ← Importar

// Entidades
import { Tarea } from './entities/tarea.entity';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from './entities/proyecto.entity';
import { Usuario } from '../auth/entitites/usuario.entity';

// Controladores
import { ClientesController } from './controllers/clientes.controller';
import { ProyectosController } from './controllers/proyectos.controller';
import { TareasController } from './controllers/tareas.controller';
import { UsuariosController } from './controllers/usuarios.controller';

// Servicios
import { TareasService } from './services/tarea.service';
import { ClientesService } from './services/clientes.service';
import { ProyectosService } from './services/proyectos.service';
import { UsuariosService } from '../auth/services/usuarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarea, Cliente, Proyecto, Usuario]),
    AuthModule,
    AuditModule, // ← Agregar AuditModule
  ],
  controllers: [
    ClientesController,
    ProyectosController,
    TareasController,
    UsuariosController,
  ],
  providers: [
    TareasService,
    ClientesService,
    ProyectosService,
    UsuariosService,
  ],
  exports: [
    TareasService,
    ClientesService,
    ProyectosService,
    UsuariosService,
  ],
})
export class GestionModule {}