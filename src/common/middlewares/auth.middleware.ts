import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  use(req: Request, res: Response, next: () => void) {
    // Implement authentication logic
    if (req.headers.authorization) {
      // Proceed if authorization header is present
      next();
    } else {
      // Respond with unauthorized if no token is found
      this.logger.error('[AuthMiddleware] Unauthorized access');

      const errorResponse = {
        meta: {
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Unauthorized',
        },
      };

      res.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
    }
  }
}
