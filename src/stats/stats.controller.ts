import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { UsePermissions } from 'src/decorators/user-permissions.decorator';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { PermissionGuard } from 'src/guards/permission.guard';
import { UserRole } from 'src/interfaces/role';
import {
  DaysStatsResponse,
  PublicStatsResponse,
  RedirectLinkStatsResponse,
  RedirectLogPageResponse,
  StatsResponse,
} from 'src/interfaces/stats';
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

  @Get('last/days/:days')
  @UseGuards(AuthGuard('jwt'))
  getLastDaysStats(
    @UserObj() user: User,
    @Param('days', new ParseIntPipe()) days: number,
  ): Promise<DaysStatsResponse[]> {
    return this.statsService.getLastDaysStats(user, days);
  }

  @Get('last/:page/:limit?')
  @UseGuards(AuthGuard('jwt'))
  getPage(
    @Param('page', new ParseIntPipe()) page: number,
    @Param('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit,
    @UserObj() user: User,
  ): Promise<RedirectLogPageResponse> {
    return this.statsService.getPage(page, limit, user);
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

  @Get('public')
  @Render('pages/stats')
  getPublicStats(): Promise<PublicStatsResponse> {
    return this.statsService.getPublicStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getStatsById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RedirectLinkStatsResponse> {
    return this.statsService.getStatsById(id);
  }
}
