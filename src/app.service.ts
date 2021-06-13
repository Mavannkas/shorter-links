import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ShortenService } from './shorten/shorten.service';
import { StatsService } from './stats/stats.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => ShortenService))
    private shortenService: ShortenService,
    @Inject(forwardRef(() => StatsService))
    private statsService: StatsService,
  ) {}

  async redirect(id: string, res, req) {
    try {
      const redirectLink = await this.shortenService.getRedirectByCustomId(id);

      this.statsService.createNewLog(req, redirectLink);

      res.redirect(redirectLink.source);
    } catch (err) {
      res.status(404).json({
        statusCode: 404,
        message: 'This redirection not exists',
        error: 'Not Found',
      }); // Zmienić na stronę z 404
    }
    return;
  }
}
