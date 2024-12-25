import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './common/middlewares/log.middleware';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, AuthModule, UserModule, RoleModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });

    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude({
    //     path: '/auth/login',
    //     method: RequestMethod.POST,
    //   })
    //   .forRoutes({
    //     path: '*',
    //     method: RequestMethod.ALL,
    //   });
  }
}
