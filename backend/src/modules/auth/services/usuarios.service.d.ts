import { Usuario } from "../entitites/usuario.entity";
import { Repository } from "typeorm";
export declare class UsuariosService {
    private readonly usuariosRespository;
    constructor(usuariosRespository: Repository<Usuario>);
    buscarUsuarioActivoPorNombre(nombre: string): Promise<Usuario | null>;
}
