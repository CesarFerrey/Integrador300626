"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("../entitites/usuario.entity");
const typeorm_2 = require("typeorm");
const estados_usuarios_enum_1 = require("../enums/estados-usuarios.enum");
const bcrypt = __importStar(require("bcrypt"));
const audit_service_1 = require("../../../audit/audit.service");
let UsuariosService = class UsuariosService {
    usuariosRespository;
    auditService;
    constructor(usuariosRespository, auditService) {
        this.usuariosRespository = usuariosRespository;
        this.auditService = auditService;
    }
    async cambiarPassword(id, password) {
        const usuarioBefore = await this.usuariosRespository.findOne({ where: { id } });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await this.usuariosRespository.update(id, { clave: hashedPassword });
        const usuarioAfter = await this.usuariosRespository.findOne({ where: { id } });
        return { result, usuarioBefore, usuarioAfter };
    }
    async recuperarPassword(email, nuevaClave) {
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
    async crearUsuario(usuarioData) {
        try {
            if (usuarioData.clave) {
                const salt = await bcrypt.genSalt(10);
                usuarioData.clave = await bcrypt.hash(usuarioData.clave, salt);
            }
            const nuevoUsuario = this.usuariosRespository.create({
                ...usuarioData,
                estado: estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO,
            });
            return await this.usuariosRespository.save(nuevoUsuario);
        }
        catch (error) {
            console.error('Error al guardar usuario:', error);
            throw new common_1.InternalServerErrorException('No se pudo registrar el usuario');
        }
    }
    async buscarPorEmail(email) {
        return await this.usuariosRespository.findOne({
            where: {
                estado: estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO,
                email: email.toLowerCase().trim(),
            },
        });
    }
    async activarUsuario(id) {
        return await this.usuariosRespository.update(id, {
            estado: estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO,
        });
    }
    async buscarUsuariosFiltrados(criterio) {
        return await this.usuariosRespository
            .createQueryBuilder('usuario')
            .where('usuario.nombre ILIKE :criterio OR usuario.email ILIKE :criterio', {
            criterio: `%${criterio}%`,
        })
            .getMany();
    }
    async findOne(id) {
        return await this.usuariosRespository.findOne({ where: { id } });
    }
    async create(createUsuarioDto, userId, userEmail, req) {
        try {
            if (createUsuarioDto.clave) {
                const salt = await bcrypt.genSalt(10);
                createUsuarioDto.clave = await bcrypt.hash(createUsuarioDto.clave, salt);
            }
            const nuevoUsuario = new usuario_entity_1.Usuario();
            nuevoUsuario.nombre = createUsuarioDto.nombre;
            nuevoUsuario.clave = createUsuarioDto.clave;
            nuevoUsuario.email = createUsuarioDto.email;
            nuevoUsuario.estado = estados_usuarios_enum_1.EstadosUsuariosEnum.ACTIVO;
            const saved = await this.usuariosRespository.save(nuevoUsuario);
            if (!saved || Array.isArray(saved)) {
                throw new Error('Error al guardar el usuario');
            }
            if (userId && userEmail && saved.id) {
                await this.auditService.logChange('Usuario', String(saved.id), 'CREATE', { after: saved }, userId, userEmail, req);
            }
            return saved;
        }
        catch (error) {
            console.error('Error al crear usuario:', error);
            throw new common_1.InternalServerErrorException('No se pudo crear el usuario');
        }
    }
    async update(id, updateUsuarioDto, userId, userEmail, req) {
        const before = await this.usuariosRespository.findOne({ where: { id } });
        if (!before) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (updateUsuarioDto.clave) {
            const salt = await bcrypt.genSalt(10);
            updateUsuarioDto.clave = await bcrypt.hash(updateUsuarioDto.clave, salt);
        }
        await this.usuariosRespository.update(id, updateUsuarioDto);
        const after = await this.usuariosRespository.findOne({ where: { id } });
        if (!after) {
            throw new common_1.NotFoundException('Usuario no encontrado después de actualizar');
        }
        if (userId && userEmail) {
            await this.auditService.logChange('Usuario', String(id), 'UPDATE', { before, after }, userId, userEmail, req);
        }
        return after;
    }
    async delete(id, userId, userEmail, req) {
        const before = await this.usuariosRespository.findOne({ where: { id } });
        if (!before) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        await this.usuariosRespository.delete(id);
        if (userId && userEmail) {
            await this.auditService.logChange('Usuario', String(id), 'DELETE', { before }, userId, userEmail, req);
        }
    }
    async cambiarPasswordConAuditoria(id, nuevaClave, userId, userEmail, req) {
        const before = await this.usuariosRespository.findOne({ where: { id } });
        if (!before) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaClave, salt);
        await this.usuariosRespository.update(id, { clave: hashedPassword });
        const after = await this.usuariosRespository.findOne({ where: { id } });
        if (userId && userEmail) {
            await this.auditService.logChange('Usuario', String(id), 'UPDATE', {
                before: { ...before, clave: '***' },
                after: { ...after, clave: '***' },
                field: 'password'
            }, userId, userEmail, req);
        }
        return { message: 'Contraseña actualizada correctamente' };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map