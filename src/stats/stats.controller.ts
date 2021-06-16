import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RedirectLinkStatsResponse, StatsResponse } from 'src/interfaces/stats';
import { StatsService } from './stats.service';

@Controller('main/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('')
  getStats(): Promise<StatsResponse> {
    return this.statsService.getStats();
  }

  @Get('anonymous')
  getAnonStats(): Promise<StatsResponse> {
    return this.statsService.getAnonStats();
  }

  @Get(':id')
  getStatsById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RedirectLinkStatsResponse> {
    return this.statsService.getStatsById(id);
  }
}
