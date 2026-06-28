import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

// Entidades
import { Tarea } from './entities/tarea.entity';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from './entities/proyecto.entity';
import { Usuario } from '../auth/entitites/usuario.entity';
import { Auditoria } from './entities/auditoria.entity'; // Y esto

// Controladores
import { ClientesController } from './controllers/clientes.controller';
import { ProyectosController } from './controllers/proyectos.controller';
import { TareasController } from './controllers/tareas.controller';
import { UsuariosController } from './controllers/usuarios.controller'; // Importa tu nuevo controlador

// Servicios
import { TareasService } from './services/tarea.service';
import { ClientesService } from './services/clientes.service';
import { ProyectosService } from './services/proyectos.service';
import { UsuariosService } from '../auth/services/usuarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarea, Cliente, Proyecto, Usuario, Auditoria]), // IMPORTANTE: Agrega Usuario y Auditoria aquí
    AuthModule,
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
  exports: [],
})
export class GestionModule {}
