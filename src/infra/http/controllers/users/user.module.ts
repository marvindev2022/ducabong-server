import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersDatabaseModule } from '@infra/database/prisma/repositories/prisma-user-database.module';
import { UsersController } from './users.controller';
import { UserService } from '@infra/http/services/users/users.service';
import { PhoneValidator } from '@app/protocols/phone/phoneValidator';
import { CpfValidator } from '@app/protocols/cpf/cpfValidator';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { EmailAlreadyExistsMiddleware } from '@infra/http/middleware/emailAlreadyExists';
import { CpfAlreadyInUseMiddleware } from '@infra/http/middleware/cpfAlreadyInUse';
import { ValidateToken } from '@infra/http/middleware/validateToken';

@Module({
  imports: [UsersDatabaseModule],
  controllers: [UsersController],
  providers: [UserService, PhoneValidator, CpfValidator, PrismaService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmailAlreadyExistsMiddleware)
      .forRoutes({ path: '/users/registered', method: RequestMethod.POST })
      .apply(CpfAlreadyInUseMiddleware)
      .forRoutes({ path: '/users/registered', method: RequestMethod.POST })
      .apply(ValidateToken)
      .exclude({
        path: '/users/:id/change-password',
        method: RequestMethod.PATCH,
      })
      .forRoutes(
        { path: '/users/*', method: RequestMethod.PUT },
        { path: '/users/*', method: RequestMethod.PATCH },
      );
  }
}
