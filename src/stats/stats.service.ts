import { forwardRef, Inject, Injectable } from '@nestjs/common';

import {
  DaysStatsResponse,
  PublicStatsResponse,
  RedirectLinkStatsResponse,
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
