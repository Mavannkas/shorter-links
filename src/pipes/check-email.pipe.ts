import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckEmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): string {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new BadRequestException('You must provide email');
    }

    return value;
  }
}
