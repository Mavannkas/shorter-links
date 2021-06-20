import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Token } from 'src/auth/entity/token.entity';
import { TokenObj } from 'src/decorators/token-obj.decorator';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { TokenResponse } from 'src/interfaces/auth';
import {
  DeleteSessionResponse,
  DeleteUserResponse,
  PasswordChangeResponse,
  RolesResponse,
} from 'src/interfaces/user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('main/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  async test() {
    return 'hello';
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@UserObj() user: User, @Res() res): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(user, res);
  }

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getSessions(
    @UserObj() user: User,
    @TokenObj() token: Token,
  ): Promise<TokenResponse[]> {
    return this.userService.getSessions(user, token);
  }

  @Delete('sessions/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteSession(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserObj() user: User,
  ): Promise<DeleteSessionResponse> {
    return this.userService.deleteSession(id, user);
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
