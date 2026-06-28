import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';
interface AuthDto {
    nombre: string;
    email: string;
    clave: string;
}
export declare class AuthService {
    private readonly usuariosService;
    private jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
    login(dto: {
        email: string;
        clave: string;
    }): Promise<{
        accessToken: string;
    }>;
    registrar(dto: AuthDto): Promise<any>;
}
export {};
