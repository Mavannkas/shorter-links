import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenModule } from './shorten/shorten.module';
import { UserModule } from './user/user.module';
import { StatsModule } from './stats/stats.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    forwardRef(() => ShortenModule),
    forwardRef(() => StatsModule),
    UserModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
