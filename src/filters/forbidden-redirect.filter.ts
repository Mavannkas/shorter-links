import { HttpException } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

@Catch()
export class ForbiddenRedirectFilter implements ExceptionFilter {
  constructor(private redirect = '/main/auth/login') {}
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (status === HttpStatus.FORBIDDEN || status === HttpStatus.UNAUTHORIZED) {
      response.status(HttpStatus.I_AM_A_TEAPOT).redirect(this.redirect);
    } else {
      response.status(status).json(exception.response);
    }
  }
}
