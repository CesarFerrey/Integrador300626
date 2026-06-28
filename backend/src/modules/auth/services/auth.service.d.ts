import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dtos/input/login.dto";
import { UsuariosService } from "./usuarios.service";
export declare class AuthService {
    private readonly usuariosService;
    private jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
