import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ActiveMailBody } from 'src/interfaces/mail';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    body: ActiveMailBody,
    template?: string,
  ): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject: `Hi, ${body.name}`,
      template,
      context: body,
    });
  }
}
