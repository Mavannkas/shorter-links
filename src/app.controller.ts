import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  redirect(@Param('id') id: string, @Res() res, @Req() req) {
    this.appService.redirect(id, res, req);
  }
}
