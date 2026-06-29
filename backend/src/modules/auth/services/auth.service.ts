import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';

interface AuthDto {
  nombre: string;
  email: string;
  clave: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(dto: {
    email: string;
    clave: string;
  }): Promise<{ accessToken: string }> {
    const email = dto.email.toLowerCase().trim();

    const usuario = await this.usuariosService.buscarPorEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Aquí comparamos la clave que llega del login (texto plano)
    // contra el hash guardado en la base de datos.
    const isMatch = await bcrypt.compare(dto.clave, usuario.clave);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      email: usuario.email,
      sub: usuario.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registrar(dto: AuthDto): Promise<any> {
    const usuarioNuevo = {
      nombre: dto.nombre,
      email: dto.email.toLowerCase().trim(),
      clave: dto.clave,
      estado: 'ACTIVO',
    };

    return await this.usuariosService.crearUsuario(usuarioNuevo as any);
  }
}
