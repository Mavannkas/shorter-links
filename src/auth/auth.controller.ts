import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  NewUserResponse,
  RecoveryPasswordResponse,
  ResendResponse,
  VerifyResponse,
} from 'src/interfaces/auth';
import { AuthService } from './auth.service';
import { registerUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth.login.dto';

import { MyAuthGuard } from 'src/guards/my-auth.guard';
import { TokenObj } from 'src/decorators/token-obj.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Token } from './entity/token.entity';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { UserNotLoginGuard } from 'src/guards/user-not-login.guard';
import { CheckEmailPipe } from 'src/pipes/check-email.pipe';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';

@Controller('main/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(new UserNotLoginGuard())
  register(@Body() registerData: registerUserDto): Promise<NewUserResponse> {
    return this.authService.registerUser(registerData);
  }

  @Get('login')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  login() {
    return 'Login site';
  }

  @Post('login')
  @UseGuards(new UserNotLoginGuard())
  loginUser(
    @Body() loginData: AuthLoginDto,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    return this.authService.login(loginData, res, req);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  logout(@TokenObj() tokenObj: Token, @Res() res: Response) {
    return this.authService.logout(tokenObj, res);
  }

  @Get('verify/:hash')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  verifyEmail(@Param('hash') hash: string): Promise<VerifyResponse> {
    return this.authService.verifyEmail(hash);
  }

  @Get('resend-email/:email')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  resendEmail(
    @Param('email', new CheckEmailPipe()) email: string,
  ): Promise<ResendResponse> {
    return this.authService.resendEmail(email);
  }

  @Get('recovery-password/:email')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  recoveryPassword(
    @Param('email', new CheckEmailPipe()) email: string,
  ): Promise<ResendResponse> {
    return this.authService.recoveryPassword(email);
  }

  @Post('change-password/:hash')
  @UseGuards(new UserNotLoginGuard())
  changePassword(
    @Param('hash') hash: string,
    @Body() password: RecoveryPasswordDto,
  ): Promise<RecoveryPasswordResponse> {
    return this.authService.changePassword(hash, password);
  }
}
