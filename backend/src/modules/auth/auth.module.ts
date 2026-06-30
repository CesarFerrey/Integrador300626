import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AdminController } from './controllers/admin.controller';
import { UsuariosController } from '../gestion/controllers/usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entitites/usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from './services/usuarios.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuditModule } from '../../audit/audit.module'; // ← IMPORTAR AuditModule

@Module({
  // 2. AGREGAR EL USUARIOSCONTROLLER A LA LISTA
  controllers: [AuthController, AdminController, UsuariosController],
  providers: [UsuariosService, AuthService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
    AuditModule, 
  ],
  exports: [AuthGuard, UsuariosService],
})
export class AuthModule {}
