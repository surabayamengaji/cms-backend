import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AllExceptionFilter } from 'src/common/filters/all-exception.filter';
import { RefreshDto } from './dtos/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new HttpException('Invalid email or password', 400);
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
