// backend/src/modules/auth/services/usuarios.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRespository: Repository<Usuario>,
    private readonly auditService: AuditService,
  ) {}

  // ============ MÉTODOS EXISTENTES ============

  async cambiarPassword(id: number, password: string): Promise<any> {
    const usuarioBefore = await this.usuariosRespository.findOne({ where: { id } });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await this.usuariosRespository.update(id, { clave: hashedPassword });
    
    const usuarioAfter = await this.usuariosRespository.findOne({ where: { id } });
    
    return { result, usuarioBefore, usuarioAfter };
  }

  async recuperarPassword(email: string, nuevaClave: string) {
    const usuario = await this.usuariosRespository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const salt = await bcrypt.genSalt(10);
    usuario.clave = await bcrypt.hash(nuevaClave, salt);
    return await this.usuariosRespository.save(usuario);
  }

  async crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario> {
    try {
      if (usuarioData.clave) {
        const salt = await bcrypt.genSalt(10);
        usuarioData.clave = await bcrypt.hash(usuarioData.clave, salt);
      }

      const nuevoUsuario = this.usuariosRespository.create({
        ...usuarioData,
        estado: EstadosUsuariosEnum.ACTIVO,
      });
      return await this.usuariosRespository.save(nuevoUsuario);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRespository.findOne({
      where: {
        estado: EstadosUsuariosEnum.ACTIVO,
        email: email.toLowerCase().trim(),
      },
    });
  }

  async activarUsuario(id: number): Promise<any> {
    return await this.usuariosRespository.update(id, {
      estado: EstadosUsuariosEnum.ACTIVO,
    });
  }

  async buscarUsuariosFiltrados(criterio: string): Promise<Usuario[]> {
    return await this.usuariosRespository
      .createQueryBuilder('usuario')
      .where(
        'usuario.nombre ILIKE :criterio OR usuario.email ILIKE :criterio',
        {
          criterio: `%${criterio}%`,
        },
      )
      .getMany();
  }

  // ============ NUEVOS MÉTODOS PARA CRUD ============

  async findOne(id: number): Promise<Usuario | null> {
    return await this.usuariosRespository.findOne({ where: { id } });
  }

  // Crear usuario con auditoría
 // Versión alternativa para create
async create(createUsuarioDto: any, userId?: string, userEmail?: string, req?: Request): Promise<Usuario> {
  try {
    // Hashear contraseña
    if (createUsuarioDto.clave) {
      const salt = await bcrypt.genSalt(10);
      createUsuarioDto.clave = await bcrypt.hash(createUsuarioDto.clave, salt);
    }

    // Guardar directamente sin create()
    const nuevoUsuario = new Usuario();
    nuevoUsuario.nombre = createUsuarioDto.nombre;
    nuevoUsuario.clave = createUsuarioDto.clave;
    nuevoUsuario.email = createUsuarioDto.email;
    nuevoUsuario.estado = EstadosUsuariosEnum.ACTIVO;

    const saved = await this.usuariosRespository.save(nuevoUsuario);

    // Verificar que es un objeto
    if (!saved || Array.isArray(saved)) {
      throw new Error('Error al guardar el usuario');
    }

    // Auditar creación
    if (userId && userEmail && saved.id) {
      await this.auditService.logChange(
        'Usuario',
        String(saved.id),
        'CREATE',
        { after: saved },
        userId,
        userEmail,
        req,
      );
    }

    return saved;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new InternalServerErrorException('No se pudo crear el usuario');
  }
}
  // Actualizar usuario con auditoría
  async update(id: number, updateUsuarioDto: any, userId?: string, userEmail?: string, req?: Request): Promise<Usuario> {
    // Obtener estado antes de actualizar
    const before = await this.usuariosRespository.findOne({ where: { id } });
    if (!before) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si viene contraseña, hashearla
    if (updateUsuarioDto.clave) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.clave = await bcrypt.hash(updateUsuarioDto.clave, salt);
    }

    // Actualizar
    await this.usuariosRespository.update(id, updateUsuarioDto);
    
    // Obtener estado después de actualizar
    const after = await this.usuariosRespository.findOne({ where: { id } });
    
    if (!after) {
      throw new NotFoundException('Usuario no encontrado después de actualizar');
    }

    // Auditar actualización
    if (userId && userEmail) {
      await this.auditService.logChange(
        'Usuario',
        String(id),
        'UPDATE',
        { before, after },
        userId,
        userEmail,
        req,
      );
    }

    return after;
  }

  // Eliminar usuario con auditoría
  async delete(id: number, userId?: string, userEmail?: string, req?: Request): Promise<void> {
    // Obtener estado antes de eliminar
    const before = await this.usuariosRespository.findOne({ where: { id } });
    if (!before) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Eliminar
    await this.usuariosRespository.delete(id);

    // Auditar eliminación
    if (userId && userEmail) {
      await this.auditService.logChange(
        'Usuario',
        String(id),
        'DELETE',
        { before },
        userId,
        userEmail,
        req,
      );
    }
  }

  // Cambiar password con auditoría
  async cambiarPasswordConAuditoria(
    id: number, 
    nuevaClave: string, 
    userId?: string, 
    userEmail?: string, 
    req?: Request
  ): Promise<any> {
    // Obtener estado antes
    const before = await this.usuariosRespository.findOne({ where: { id } });
    if (!before) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaClave, salt);
    
    // Actualizar
    await this.usuariosRespository.update(id, { clave: hashedPassword });
    
    // Obtener estado después
    const after = await this.usuariosRespository.findOne({ where: { id } });

    // Auditar cambio de contraseña
    if (userId && userEmail) {
      await this.auditService.logChange(
        'Usuario',
        String(id),
        'UPDATE',
        { 
          before: { ...before, clave: '***' },
          after: { ...after, clave: '***' },
          field: 'password'
        },
        userId,
        userEmail,
        req,
      );
    }

    return { message: 'Contraseña actualizada correctamente' };
  }
}