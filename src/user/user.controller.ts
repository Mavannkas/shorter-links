import {
  Controller,
  Delete,
  Get,
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
import { DeleteUserResponse } from 'src/interfaces/user';
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

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  getSessions(@UserObj() user: User): Promise<TokenResponse[]> {
    return this.userService.getSessions(user);
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@UserObj() user: User, @Res() res): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(user, res);
  }
}
