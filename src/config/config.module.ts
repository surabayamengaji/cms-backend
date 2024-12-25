import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { PrismaService } from 'src/common/services/prisma.service';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class ConfigModule {}
