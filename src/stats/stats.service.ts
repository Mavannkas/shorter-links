import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ShortenService } from 'src/shorten/shorten.service';
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
}
