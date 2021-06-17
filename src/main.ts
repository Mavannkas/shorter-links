import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,

      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
