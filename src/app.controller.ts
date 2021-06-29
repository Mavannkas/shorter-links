import { Controller, Get, Param, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  onApplicationBootstrap(): void {
    console.log('Ready!');
  }

  @Get('')
  @Render('pages/index')
  getMain() {
    return;
  }

  @Get('about-us')
  @Render('pages/about-us')
  getAboutUs() {
    return;
  }

  @Get('faq')
  @Render('pages/faq')
  getFaq() {
    return;
  }

  @Get(':id')
  redirect(@Param('id') id: string, @Res() res, @Req() req) {
    this.appService.redirect(id, res, req);
  }
}
