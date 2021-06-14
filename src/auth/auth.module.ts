import { forwardRef, Module, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => MailModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
