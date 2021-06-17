import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { MyAuthGuard } from 'src/guards/my-auth.guard';

import {
  createNewRedirectResponse,
  DeleteRedirectLinkResponse,
  RedirectLinkPageResponse,
  RedirectLinkResponse,
} from 'src/interfaces/redirect-link';
import { User } from 'src/user/entity/user.entity';
import { CreateNewRedirectLinkDto } from './dto/create-new-redirect-link.dto';
import { UpdateRedirectLinkDto } from './dto/update-redirect-link.dto';
import { ShortenService } from './shorten.service';

@Controller('main/shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post('')
  @UseGuards(MyAuthGuard)
  createNewRedirect(
    @Body() createNewRedirectData: CreateNewRedirectLinkDto,
    @UserObj() user?: User,
  ): Promise<createNewRedirectResponse> {
    return this.shortenService.createNewRedirect(createNewRedirectData, user);
  }

  @Get('pages/:page/:limit?')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getRedirectLinkPage(
    @Param('page', new ParseIntPipe()) page: number,
    @Param('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit,
    @UserObj() user?: User,
  ): Promise<RedirectLinkPageResponse> {
    return this.shortenService.getRedirectLinkPage(page, limit, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getRedirectLink(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserObj() user?: User,
  ): Promise<RedirectLinkResponse> {
    return this.shortenService.getRedirectLink(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateRedirectLink(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateData: UpdateRedirectLinkDto,
    @UserObj() user?: User,
  ): Promise<RedirectLinkResponse> {
    return this.shortenService.updateRedirectLink(id, updateData, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteRedirectLink(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserObj() user?: User,
  ): Promise<DeleteRedirectLinkResponse> {
    return this.shortenService.deleteRedirectLink(id, user);
  }
}
