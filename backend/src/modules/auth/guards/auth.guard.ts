// backend/src/auth/guards/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        console.log('🔐 [AUTH GUARD] Verificando token...');
        
        if (!token) {
            console.log('❌ [AUTH GUARD] Token no encontrado');
            throw new UnauthorizedException();
        }
        
        try {
            const payload = await this.jwtService.verifyAsync(token);
            console.log('✅ [AUTH GUARD] Token verificado:', payload);
            
            // Asignar el usuario a req.user (NOMBRE CORRECTO)
            request.user = {
                id: payload.sub || payload.id,
                email: payload.email,
                username: payload.username || payload.email,
                ...payload,
            };
            
            // También mantener en req.usuario por compatibilidad
            request['usuario'] = payload;
            
            console.log('✅ [AUTH GUARD] Usuario asignado a req.user:', request.user);
            
            return true;
        } catch (error) {
            console.error('❌ [AUTH GUARD] Error verificando token:', error.message);
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request.headers['authorization'];
        if (!authHeader) return undefined;
        
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}