"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const usuarios_service_1 = require("./services/usuarios.service");
const auth_service_1 = require("./services/auth.service");
const auth_guard_1 = require("./guards/auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [usuarios_service_1.UsuariosService, auth_service_1.AuthService, auth_guard_1.AuthGuard],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.Usuario]),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                global: true,
                useFactory: (configService) => {
                    return {
                        secret: process.env.JWT_SECRET,
                        signOptions: { expiresIn: '8h' },
                    };
                },
            }),
        ],
        exports: [
            auth_guard_1.AuthGuard,
            jwt_1.JwtModule,
            usuarios_service_1.UsuariosService
        ]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map