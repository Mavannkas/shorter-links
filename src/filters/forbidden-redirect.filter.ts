import {
  HttpException,
  ImATeapotException,
  UnauthorizedException,
} from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

@Catch(ImATeapotException, UnauthorizedException)
export class ForbiddenRedirectFilter implements ExceptionFilter {
  constructor(private redirect = '/main/auth/login') {}
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.I_AM_A_TEAPOT).redirect(this.redirect);
  }
}
