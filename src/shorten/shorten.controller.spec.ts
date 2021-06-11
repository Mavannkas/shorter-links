import { Test, TestingModule } from '@nestjs/testing';
import { ShortenController } from './shorten.controller';
import { ShortenService } from './shorten.service';

describe('ShortenController', () => {
  let controller: ShortenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenController],
      providers: [ShortenService],
    }).compile();

    controller = module.get<ShortenController>(ShortenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
