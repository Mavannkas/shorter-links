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
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Token } from 'src/auth/entity/token.entity';
import { TokenObj } from 'src/decorators/token-obj.decorator';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { TokenPageResponse, TokenResponse } from 'src/interfaces/auth';
import {
  DeleteSessionResponse,
  DeleteUserResponse,
  PanelResponse,
  PasswordChangeResponse,
  RolesResponse,
} from 'src/interfaces/user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionNameDto } from './dto/session-name.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('main/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  @Render('pages/panel/home')
  getHome(): PanelResponse {
    return {
      subPage: 'Home',
    };
  }

  @Get('redirects')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  @Render('pages/panel/redirects')
  getRedirects(): PanelResponse {
    return {
      subPage: 'Redirects',
    };
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  @Render('pages/panel/stats')
  getStats(): PanelResponse {
    return {
      subPage: 'Stats',
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  @Render('pages/panel/profile')
  getProfile(@UserObj() user: User): PanelResponse {
    return {
      date: user.created_at.toLocaleDateString(),
      subPage: 'Profile',
    };
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@UserObj() user: User, @Res() res): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(user, res);
  }

  @Get('sessions/:page/:limit?')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getSessions(
    @Param('page', new DefaultValuePipe(10), new ParseIntPipe()) page: number,
    @UserObj() user: User,
    @TokenObj() token: Token,
  ): Promise<TokenPageResponse> {
    return this.userService.getSessions(user, token, page);
  }

  @Delete('sessions/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteSession(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserObj() user: User,
  ): Promise<DeleteSessionResponse> {
    return this.userService.deleteSession(id, user);
  }

  @Patch('sessions/:id')
  @UseGuards(AuthGuard('jwt'))
  addSessionName(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserObj() user: User,
    @Body() name: SessionNameDto,
  ): Promise<TokenResponse> {
    return this.userService.addSessionName(id, user, name);
  }

  @Get('roles')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getRoles(@UserObj() user: User): Promise<RolesResponse[]> {
    return this.userService.getRoles(user);
  }

  @Patch('password-change')
  @UseGuards(AuthGuard('jwt'))
  changePass(
    @UserObj() user: User,
    @Body() password: ChangePasswordDto,
    @TokenObj() token: Token,
  ): Promise<PasswordChangeResponse> {
    return this.userService.changePass(user, password, token);
  }
}
