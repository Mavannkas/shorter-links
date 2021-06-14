import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  createNewRedirectResponse,
  DeleteRedirectLinkResponse,
  RedirectLinkPageResponse,
  RedirectLinkResponse,
} from 'src/interfaces/redirect-link';
import { CreateNewRedirectLinkDto } from './dto/create-new-redirect-link.dto';
import { UpdateRedirectLinkDto } from './dto/update-redirect-link.dto';
import { ShortenService } from './shorten.service';

@Controller('main/shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post('')
  createNewRedirect(
    @Body() createNewRedirectData: CreateNewRedirectLinkDto,
  ): Promise<createNewRedirectResponse> {
    return this.shortenService.createNewRedirect(createNewRedirectData);
  }

  @Get('pages/:page/:limit?')
  getRedirectLinkPage(
    @Param('page', new ParseIntPipe()) page: number,
    @Param('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit,
  ): Promise<RedirectLinkPageResponse> {
    return this.shortenService.getRedirectLinkPage(page, limit);
  }

  @Get(':id')
  getRedirectLink(@Param('id') id: string): Promise<RedirectLinkResponse> {
    return this.shortenService.getRedirectLink(id);
  }

  @Patch(':id')
  updateRedirectLink(
    @Param('id') id: string,
    @Body() updateData: UpdateRedirectLinkDto,
  ): Promise<RedirectLinkResponse> {
    return this.shortenService.updateRedirectLink(id, updateData);
  }

  @Delete(':id')
  deleteRedirectLink(
    @Param('id') id: string,
  ): Promise<DeleteRedirectLinkResponse> {
    return this.shortenService.deleteRedirectLink(id);
  }
}
