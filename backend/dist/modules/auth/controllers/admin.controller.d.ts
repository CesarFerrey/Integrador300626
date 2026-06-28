import { UsuariosService } from '../services/usuarios.service';
export declare class AdminController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    buscarUsuarios(criterio: string): Promise<import("../entitites/usuario.entity").Usuario[]>;
    activarUsuario(id: number): Promise<void>;
}
