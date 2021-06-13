import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  createNewRedirectResponse,
  RedirectLinkResponse,
} from 'src/interfaces/redirect-link';
import { CreateNewRedirectLinkDto } from './dto/create-new-redirect-link.dto';
import {
  UpdateRedirectLinkCustomIdDto,
  UpdateRedirectLinkDto,
  UpdateRedirectLinkSourceDto,
} from './dto/update-redirect-link.dto';
import { ShortenService } from './shorten.service';

@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post('create')
  createNewRedirect(
    @Body() createNewRedirectData: CreateNewRedirectLinkDto,
  ): Promise<createNewRedirectResponse> {
    return this.shortenService.createNewRedirect(createNewRedirectData);
  }

  @Get(':id')
  getRedirectLink(@Param('id') id: string): Promise<RedirectLinkResponse> {
    return this.shortenService.getRedirectLink(id);
  }

  // @Patch(':id')
  // updateRedirectLink(
  //   @Param('id') id: string,
  //   @Body() updateData: UpdateRedirectLinkDto,
  // ): Promise<RedirectLinkResponse> {
  //   return this.shortenService.updateRedirectLink(id, updateData);
  // }

  // @Patch(':id/custom')
  // updateRedirectLinkCustomId(
  //   @Param('id') id: string,
  //   @Body() updateData: UpdateRedirectLinkCustomIdDto,
  // ): Promise<RedirectLinkResponse> {
  //   return this.shortenService.updateRedirectLinkCustomId(id, updateData);
  // }

  // @Patch(':id/source')
  // updateRedirectLinkSource(
  //   @Param('id') id: string,
  //   @Body() updateData: UpdateRedirectLinkSourceDto,
  // ): Promise<RedirectLinkResponse> {
  //   return this.shortenService.updateRedirectLinkSource(id, updateData);
  // }

  // @Delete(':id')
  // deleteRedirectLink(@Param('id') id: string): Promise<RedirectLinkResponse> {
  //   return this.shortenService.deleteRedirectLink(id);
  // }
}
