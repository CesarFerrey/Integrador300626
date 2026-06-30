import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
import { AuditService } from '../../../audit/audit.service';
import { Request } from 'express';
export declare class UsuariosService {
    private readonly usuariosRespository;
    private readonly auditService;
    constructor(usuariosRespository: Repository<Usuario>, auditService: AuditService);
    cambiarPassword(id: number, password: string): Promise<any>;
    recuperarPassword(email: string, nuevaClave: string): Promise<Usuario>;
    crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    activarUsuario(id: number): Promise<any>;
    buscarUsuariosFiltrados(criterio: string): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario | null>;
    create(createUsuarioDto: any, userId?: string, userEmail?: string, req?: Request): Promise<Usuario>;
    update(id: number, updateUsuarioDto: any, userId?: string, userEmail?: string, req?: Request): Promise<Usuario>;
    delete(id: number, userId?: string, userEmail?: string, req?: Request): Promise<void>;
    cambiarPasswordConAuditoria(id: number, nuevaClave: string, userId?: string, userEmail?: string, req?: Request): Promise<any>;
}
