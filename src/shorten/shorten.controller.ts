import { Controller } from '@nestjs/common';
import { ShortenService } from './shorten.service';

@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}
}
