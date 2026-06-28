import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }

  @Post('registrar')
  async registrar(@Body() dto: any): Promise<any> {

    console.log('DATOS REGISTRO:', dto);

    return await this.authService.registrar(dto);
  }
}
