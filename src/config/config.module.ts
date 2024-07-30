import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { Prisma } from "src/common/providers/prisma";
import { Validation } from "src/common/providers/validation";
import * as winston from "winston";

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: "debug",
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [Prisma, Validation],
  exports: [Prisma, Validation],
})
export class ConfigModule {}
