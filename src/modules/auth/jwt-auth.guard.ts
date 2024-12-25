import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.userEmail = payload.email;
      request.userId = payload.sub;

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
