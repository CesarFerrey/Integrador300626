import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
export declare class UsuariosService {
    private readonly usuariosRespository;
    constructor(usuariosRespository: Repository<Usuario>);
    cambiarPassword(id: number, password: string): Promise<any>;
    recuperarPassword(email: string, nuevaClave: string): Promise<Usuario>;
    crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    activarUsuario(id: number): Promise<any>;
    buscarUsuariosFiltrados(criterio: string): Promise<Usuario[]>;
}
