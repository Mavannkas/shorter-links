import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { UsePermissions } from 'src/decorators/user-permissions.decorator';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { PermissionGuard } from 'src/guards/permission.guard';
import { UserRole } from 'src/interfaces/role';
import { RedirectLinkStatsResponse, StatsResponse } from 'src/interfaces/stats';
import { User } from 'src/user/entity/user.entity';
import { StatsService } from './stats.service';

@Controller('main/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  getStats(@UserObj() user: User): Promise<StatsResponse> {
    return this.statsService.getStats(user);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @UsePermissions(UserRole.Analyst, UserRole.Admin)
  getAllStats(): Promise<StatsResponse> {
    return this.statsService.getAllStats();
  }

  @Get('anonymous')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @UsePermissions(UserRole.Analyst, UserRole.Admin)
  @UseFilters(new ForbiddenRedirectFilter())
  getAnonStats(): Promise<StatsResponse> {
    return this.statsService.getAnonStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getStatsById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RedirectLinkStatsResponse> {
    return this.statsService.getStatsById(id);
  }
}
