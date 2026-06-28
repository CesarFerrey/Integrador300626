import { UsuariosService } from '../../auth/services/usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(nombre?: string): Promise<import("../../auth/entitites/usuario.entity").Usuario[]>;
    cambiarPassword(id: number, nuevaClave: string): Promise<{
        message: string;
    }>;
    recuperarPassword(body: {
        email: string;
        nuevaClave: string;
    }): Promise<import("../../auth/entitites/usuario.entity").Usuario>;
}
