import { Controller, Get, Param, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  onApplicationBootstrap(): void {
    console.log('Ready!');
  }

  @Get('')
  @Render('pages/home')
  getHello() {
    return {
      msg: 'hello',
    };
  }

  @Get(':id')
  redirect(@Param('id') id: string, @Res() res, @Req() req) {
    this.appService.redirect(id, res, req);
  }
}
