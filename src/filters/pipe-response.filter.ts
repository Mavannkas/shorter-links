import { HttpException } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

@Catch()
export class PipeResponseFilter implements ExceptionFilter {
  constructor(private template) {}
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = Array.isArray(exception.response.message)
      ? exception.response.message.join('<br><br>')
      : exception.response.message;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest<Request>();

    response
      .status(status)
      .render(`pages/${this.template}`, { error: message, body: request.body });
  }
}
