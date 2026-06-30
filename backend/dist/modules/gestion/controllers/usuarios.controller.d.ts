import { UsuariosService } from '../../auth/services/usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(nombre?: string): Promise<import("../../auth/entitites/usuario.entity").Usuario[]>;
    findOne(id: number): Promise<import("../../auth/entitites/usuario.entity").Usuario>;
    create(createUsuarioDto: any, req: any): Promise<import("../../auth/entitites/usuario.entity").Usuario>;
    update(id: number, updateUsuarioDto: any, req: any): Promise<import("../../auth/entitites/usuario.entity").Usuario>;
    delete(id: number, req: any): Promise<{
        message: string;
    }>;
    cambiarPassword(id: number, nuevaClave: string, req: any): Promise<any>;
    recuperarPassword(body: {
        email: string;
        nuevaClave: string;
    }): Promise<import("../../auth/entitites/usuario.entity").Usuario>;
}
