import { LoginDto } from '../dtos/input/login.dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    registrar(dto: any): Promise<any>;
}
