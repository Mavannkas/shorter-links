import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { JwtStrategy } from './jwt.strategy';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
    forwardRef(() => StatsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
