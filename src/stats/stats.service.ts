import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RedirectItemResponse } from 'src/interfaces/redirect-log';

import {
  DaysStatsResponse,
  PublicStatsResponse,
  RedirectLinkStatsResponse,
  RedirectLogPageResponse,
  StatsResponse,
} from 'src/interfaces/stats';
import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';
import { ShortenService } from 'src/shorten/shorten.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { getConnection } from 'typeorm';
import { RedirectLog } from './entity/redirect-log.entity';

@Injectable()
export class StatsService {
  constructor(
    @Inject(forwardRef(() => ShortenService))
    private shortenService: ShortenService,
  ) {}

  async createNewLog(req, redirectLink): Promise<void> {
    const client = this.getClientDataFromReq(req);
    const log = this.createLog(client, redirectLink);
    await log.save();
  }

  getClientDataFromReq(req) {
    return {
      agent: req.header('user-agent'),
      referrer: req.header('referrer'),
      ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
    };
  }

  createLog({ ip, agent, referrer }, redirectLink): RedirectLog {
    const log = new RedirectLog();
    log.referrer = referrer;
    log.agent = agent;
    log.ip = ip;
    log.redirect_link_id = redirectLink;

    return log;
  }

  async getStats(user: User): Promise<StatsResponse> {
    const redirectCount = await getConnection()
      .createQueryBuilder()
      .select('redirectLog')
      .from(RedirectLog, 'redirectLog')
      .leftJoinAndSelect('redirectLog.redirect_link_id', 'redirect_link_id')
      .leftJoinAndSelect('redirect_link_id.user_id', 'user_id')
      .where('user_id.user_id = :id', {
        id: user.user_id,
      })
      .getCount();
    return { redirectCount };
  }

  async getLastDaysStats(
    user: User,
    days: number,
  ): Promise<DaysStatsResponse[]> {
    const result = await getConnection()
      .createQueryBuilder()
      .select([
        'DATE(redirectLog.created_at) as date',
        'COUNT(redirectLog.redirect_link_id) as redirectCount',
      ])
      .from(RedirectLog, 'redirectLog')
      .leftJoinAndSelect('redirectLog.redirect_link_id', 'redirect_link_id')
      .leftJoinAndSelect('redirect_link_id.user_id', 'user_id')
      .where('user_id.user_id = :id', {
        id: user.user_id,
      })
      .andWhere('redirectLog.created_at >= DATE(NOW()) - INTERVAL :days DAY', {
        days,
      })
      .groupBy('DAY(redirectLog.created_at)')
      .orderBy('redirectLog.created_at')
      .getRawMany();

    return result.map((item) => ({
      day: item.date,
      redirectCount: item.redirectCount,
    }));
  }

  async getPage(
    page: number,
    limit: number,
    user: User,
  ): Promise<RedirectLogPageResponse> {
    if (page <= 0) throw new BadRequestException('Page must be positive');

    const result = this.getUserLogs(user);

    const selectedLogs = (await result.getRawMany()).splice(
      limit * (page - 1),
      limit,
    );

    const count = await result.getCount();

    const lastPage = Math.ceil(count / limit);

    const items: RedirectItemResponse[] = selectedLogs.map((item) => ({
      ip: item.redirectLog_ip,
      agent: item.redirectLog_agent,
      referrer: item.redirectLog_referrer,
      created_at: item.redirectLog_created_at,
    }));

    return {
      items,
      page,
      lastPage,
    };
  }

  getUserLogs(user: User) {
    return getConnection()
      .createQueryBuilder()
      .select('redirectLog')
      .from(RedirectLog, 'redirectLog')
      .leftJoinAndSelect('redirectLog.redirect_link_id', 'redirect_link_id')
      .leftJoinAndSelect('redirect_link_id.user_id', 'user_id')
      .where('user_id.user_id = :id', {
        id: user.user_id,
      })
      .orderBy('redirectLog.created_at');
  }

  async getAllStats(): Promise<StatsResponse> {
    const redirectCount = await RedirectLog.count();
    return { redirectCount };
  }

  async getAnonStats(): Promise<StatsResponse> {
    const redirectCount = await getConnection()
      .createQueryBuilder()
      .select('redirectLog')
      .from(RedirectLog, 'redirectLog')
      .leftJoinAndSelect('redirectLog.redirect_link_id', 'redirect_link_id')
      .leftJoinAndSelect('redirect_link_id.user_id', 'user_id')
      .where('user_id is null')
      .getCount();
    return { redirectCount };
  }

  async getStatsById(id: string): Promise<RedirectLinkStatsResponse> {
    const redirectLink = await RedirectLink.findOne(id);
    const redirectCount = await getConnection()
      .createQueryBuilder()
      .select('redirectLog')
      .from(RedirectLog, 'redirectLog')
      .leftJoinAndSelect('redirectLog.redirect_link_id', 'redirect_link_id')
      .where('redirect_link_id = :id', {
        id: id,
      })
      .getCount();
    return {
      redirectLink: this.shortenService.prepareResponseData(redirectLink),
      redirectCount,
    };
  }

  async getPublicStats(): Promise<PublicStatsResponse> {
    const redirects = await RedirectLog.count();
    const redirectLinks = await RedirectLink.count();
    return {
      redirectLinks,
      redirects,
    };
  }
}
