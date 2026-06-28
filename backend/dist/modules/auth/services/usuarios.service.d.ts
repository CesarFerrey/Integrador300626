import { Usuario } from "../entities/usuario.entity";
import { Repository } from "typeorm";
export declare class UsuariosService {
    private readonly usuariosRespository;
    constructor(usuariosRespository: Repository<Usuario>);
    buscarUsuarioActivoPorNombre(nombre: string): Promise<Usuario | null>;
}
