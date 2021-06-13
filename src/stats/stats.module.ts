import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { ShortenModule } from 'src/shorten/shorten.module';

@Module({
  imports: [forwardRef(() => ShortenModule)],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
