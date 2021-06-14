import { Controller } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('main/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
}
