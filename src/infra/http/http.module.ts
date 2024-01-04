import { Module } from '@nestjs/common';
import { UsersModule } from './controllers/users/user.module';
import { MailQueueModule } from './controllers/mail/mail.module';
@Module({
  imports: [
    UsersModule,
    MailQueueModule,
  ],
})
export class HttpModule {}
