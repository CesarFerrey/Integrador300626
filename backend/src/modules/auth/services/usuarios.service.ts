import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRespository: Repository<Usuario>,
  ) {}

  async cambiarPassword(id: number, password: string): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await this.usuariosRespository.update(id, { clave: hashedPassword });
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
      // Hasheo garantizado aquí
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

  // CORREGIDO: Renombrado a buscarPorEmail para mayor claridad
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
}
